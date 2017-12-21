// declare dependencies:
var express = require('express');
var app = express();
var fs = require('fs');
var CSV = require('csv-string');
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var multer = require('multer'); // npm install multer --save
var upload = multer({dest: __dirname + '/public/uploads'});
var schedule = require('node-schedule');
var client = require('scp2');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

require("./app.js");
var port = process.env.PORT || 3000;
app.listen(port);

// set paths for HTTP requests:

app.get("/api/vendor-list", getFiles);
app.get("/api/cats", getCategories);
app.get("/api/cats/osd", getOSDCategories);

app.post("/api/updateCats", updateCats);
app.post("/api/upload/image", upload.single('myFile'), uploadFile);
app.post("/api/upload/p", upload.single('myFile'), uploadFileProcurement);
app.post("/api/upload/odepartments", upload.single('myFile'), uploadFileODepartments);
app.post("/api/upload/adepartments", upload.single('myFile'), uploadFileADepartments);
app.post("/api/upload/oemployees", upload.single('myFile'), uploadFileOEmployees);
app.post("/api/upload/aemployees", upload.single('myFile'), uploadFileAEmployees);
app.post("/api/upload/kpi", upload.single('myFile'), uploadFileKPI);
app.post("/api/upload/vendorData", upload.single('myFile'), uploadFileVendor);
app.post("/api/upload/vendorOptions", upload.single('myFile'), uploadVendorOptions);
app.post("/api/upload/osdIcon", upload.single('myFile'), uploadIcon);

app.delete("/api/remove", removeVendor);

// when the clock hits 11:59PM, pull the files
var j = schedule.scheduleJob({hour: 23, minute: 59}, function () {
    pullFromFTP();
});

//at 12:15 AM run the updates
var k = schedule.scheduleJob({hour: 00, minute: 30}, function () {
    parseApprovalsReport();
    treeInfoToJSON();
});

//pullFromFTP();
// pulls the files from the server, deletes the first line of the file
function pullFromFTP() {
    /*client.scp({
        host: 'mbtaftp.mbta.com',
        username: 'mbtadotcom',
        port: 10022,
        password: "Pr0gr3ss",
        path: './ORGCHART_6.csv'
    }, './public/csv/budgetdata.csv', function (err) {
        if (err) {
            console.log("rut roe, there's been an error: " + err);
        }
    });

    client.scp({
        host: 'mbtaftp.mbta.com',
        username: 'mbtadotcom',
        port: 10022,
        password: process.env.ftp_password,
        path: './ORGCHART_4.csv'
    }, './public/csv/approver_report.csv', function (err) {
        if (err) {
            console.log("rut roe, there's been an error: " + err);
        }
    });
    client.scp({
        host: 'mbtaftp.mbta.com',
        username: 'mbtadotcom',
        port: 10022,
        password: process.env.ftp_password,
        path: './ORGCHART_5.csv'
    }, './public/csv/procurementdata.csv', function (err) {
        if (err) {
            console.log("rut roe, there's been an error: " + err);
        }
    });
    client.scp({
        host: 'mbtaftp.mbta.com',
        username: 'mbtadotcom',
        port: 10022,
        password: process.env.ftp_password,
        path: './ORGCHART_1.csv'
    }, './public/csv/requestors.csv', function (err) {
        if (err) {
            console.log("rut roe, there's been an error: " + err);
        }
    });
    client.scp({
        host: 'mbtaftp.mbta.com',
        username: 'mbtadotcom',
        port: 10022,
        password: process.env.ftp_password,
        path: './ORGCHART_2.csv'
    }, './public/csv/PSTREENODE.csv', function (err) {
        if (err) {
            console.log("rut roe, there's been an error: " + err);
        }
    });
    client.scp({
        host: 'mbtaftp.mbta.com',
        username: 'mbtadotcom',
        port: 10022,
        password: process.env.ftp_password,
        path: './ORGCHART_3.csv'
    }, './public/csv/DEPT_TBL.csv', function (err) {
        if (err) {
            console.log("rut roe, there's been an error: " + err);
        }
    });
    */
}

// is supposed to remove a vendor from the DVA pages, does not currently do anything...
function removeVendor(req, res) {
    var vendorName = req.body;
    console.log('removing vendor');
}

// upload a file of operating employees
function uploadFileOEmployees(req, res) {
    var myFile = req.file;
    fs.rename(__dirname + '/public/uploads/' + myFile.filename, __dirname + '/public/resources/operatingEmployees.json');
    var callbackUrl = "/#!/employees";
    res.redirect(callbackUrl);
}

// upload icons for the categories
function uploadIcon(req, res) {
    var myFile = req.file;
    var fileName = req.body.selectedCat + ".png";
    fs.rename(__dirname + '/public/uploads/' + myFile.filename, __dirname + '/public/resources/icons/' + fileName);
    var callbackUrl = "/#!/categories";
    res.redirect(callbackUrl);
}

// update the categories list
function updateCats(req, res) {
    var myFile = JSON.stringify(req.body);
    fs.writeFile("./public/resources/cats.json", myFile);
    var callbackUrl = "/#!/categories";
    res.redirect(callbackUrl);
}

// gets the vendor data file
function getFiles(req, res) {
    var files = fs.readdirSync(__dirname + '/public/vendor-data');
    res.send(files);
}

// sends the OSD categories in JSON format
function getCategories(req, res) {
    var file = JSON.parse(fs.readFileSync('./public/resources/cats.json', 'utf8'));
    res.send(file);
}

// scrapes the OSD site for the categories... I will do my best to comment it,
// but honestly I don't remember what some of this is supposed to do- there's this whole thing where
// some of it depends on var % 2, which is mod 2, which is like odds and evens. I think it might have to do with
// codes being on the evens and descriptions on the odds?? I know this is not really helpful
function getOSDCategories(req, res) {
    // url of the OSD categories page
    var url = 'http://www.mass.gov/anf/budget-taxes-and-procurement/procurement-info-and-res/buy-from-a-state-contract/statewide-contract-user-guides.html';
    // creates a new date object
    var date = new Date();
    // adds today's date to the JSON and initializes the final object
    var finalJSON = {
        "date-pulled": (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear(),
        "children": []
    };
    // here is where the scarping starts:
    request(url, function (error, response, html) {
        var $ = cheerio.load(html);
        var codeArray = [];
        // grabs the contract codes and descriptions from the table of contents

        // grabs the element with the class 'bodyfield'
        var links = $('.bodyfield');
        // for each of the link texts, finds the bold links and extrapolates its text
        $(links).each(function (i, link) {
            contracts = $(link).find('strong a').text();
        });
        // Regular expression to find 3 letters with a dash
        var regEx = new RegExp('[A-Z]{3} - ');
        // splits the text of all of the codes and descriptions by the regex
        descriptions = contracts.split(regEx);
        // removes the first description
        descriptions.splice(0, 1);
        // regular Expression for finding _-_
        var regEx2 = new RegExp(' - ');
        // splits by dash
        codes = contracts.split(regEx2);
        codes = codes.map(function (e) {
            // splices by 3s (?)
            e = e.slice(-3);
            // adds the code to the array of codes
            codeArray.push(e);
        });
        var finalCodes = [];
        for (code in codeArray) {
            // makes sure whatever it picked up is actually a code from the table of contents
            if (codeArray[code].toUpperCase() == codeArray[code]) {
                finalCodes.push(codeArray[code]);
            }
        }
        // adds a misc category for everything it can't classify
        finalCodes.push("Misc");
        descriptions.push("Miscellaneous");

        // adds all of the codes and descriptions to the final tree.
        for (description in descriptions) {
            finalJSON.children.push({
                "code": finalCodes[description],
                "name": descriptions[description],
                "isParent": true,
                "_children": []
            });
        }
        // gets the elements containing the contract names, descriptions, including those without links
        var contractNames = $('.col .callout .lead_snippet .titlelink');
        var contractDesc = $('.col .callout p').text();
        var unlinkedContracts = $('.col .callout p strong');
        var othersString = unlinkedContracts.text();
        // some text cleaning
        othersString = othersString.replace(/Back to Top/g, '');
        var otherStrings = othersString.replace(/OSC/g, 'OSC ');
        // splits by 3 letters, unlimited digits and anything that happens to come after (?)
        otherStrings = otherStrings.split(new RegExp('([A-Z]{3}[0-9]+[^]*?)'));
        // splits by 'Back to Top'
        contractDesc = contractDesc.split(new RegExp('Back to Top'));
        // for each contract, looks to see if the parent code is in the JSON already
        $(contractNames).each(function (i, link) {
            var found = false;
            // gets contract name
            var cn = $(link).text();
            // gets rid of spaces (?)
            cn = cn.replace(/\s/g, '');
            // creates link
            var link = "http://www.mass.gov" + $(link).attr('href');
            // creates contract object
            var cname = {"code": cn, "link": link, "name": ""};
            // finds if the code is in the JSON, if it isn't, puts the contract in the MISC category
            for (child in finalJSON.children) {
                if (finalJSON.children[child].code == cn.substr(0, 3)) {
                    found = true;
                    finalJSON.children[child]._children.push(cname);
                }
            }
            if (!found) {
                for (child in finalJSON.children) {
                    if (finalJSON.children[child].code == "Misc") {
                        finalJSON.children[child]._children.push(cname);
                    }
                }
            }
        });
        // Gets rid of first element (?)
        otherStrings.shift();

        // this next part is kind of a mystery to me- I have no clue why odds and evens are involved.
        // this code does the same thing as what is above, just with the unlinked contracts (I think?)
        var odds = [];
        var evens = [];

        for (s in otherStrings) {
            if (s % 2 == 0) {
                odds.push(otherStrings[s]);
            }
            else {
                evens.push(otherStrings[s]);
            }
        }
        for (odd in odds) {
            var newString = odds[odd] + "" + evens[odd];
            newString = newString.replace(/\s+/g, '');
            odds[odd] = newString;
        }
        for (ulContract in odds) {

            for (child in finalJSON.children) {
                var cname = {
                    "code": odds[ulContract],
                    "link": "",
                    "name": ""
                };
                if (finalJSON.children[child].code == odds[ulContract].substr(0, 3)) {
                    found = true;
                    finalJSON.children[child]._children.push(cname);
                }
            }
            if (!found) {
                for (child in finalJSON.children) {
                    if (finalJSON.children[child].code == "Misc") {
                        finalJSON.children[child]._children.push(cname);
                    }
                }

            }
        }
        // matches contract description to its object
        for (con in contractDesc) {
            if (contractDesc[con].replace(/\s/g, '').length > 0) {
                var codescstring = myTrim(contractDesc[con]);
                var desc = [];
                desc = codescstring.split(new RegExp("([A-Z]{3}[0-9]+[^@]*?-)"));
                for (var d = 0; d < desc.length; d++) {
                    if (desc[d].replace(/\s/g, '').length > 0) {
                        // again with the odds??
                        if (d % 2 === 1) {
                            var found = false;
                            var codeName = desc[d];
                            // clean up the text
                            codeName = codeName.replace('-', '');
                            codeName = codeName.replace('file size 1MB', '');
                            codeName = codeName.replace(/\s/g, '');

                            for (child in finalJSON.children) {
                                for (childs in finalJSON.children[child]._children) {
                                    if (finalJSON.children[child]._children[childs].code == codeName && d != desc.length) {
                                        finalJSON.children[child]._children[childs]['name'] = myTrim(desc[d + 1]);
                                        found = true;
                                    }
                                }

                                if (!found && finalJSON.children[child].code == "Misc") {
                                    //console.log('putting in misc');
                                    finalJSON.children[child]._children[childs]['name'] = myTrim(desc[d + 1]);
                                }
                            }
                        }
                    }
                }
            }
        }

        function myTrim(x) {
            return x.replace(/^\s+|\s+$/gm, '');
        }

        // set the categories file as the newly created JSON
        fs.writeFile(__dirname + '/public/resources/cats.json', JSON.stringify(finalJSON));

        res.send(finalJSON);
    });
}

function uploadFileAEmployees(req, res) {
    var myFile = req.file;
    fs.rename(__dirname + '/public/uploads/' + myFile.filename, __dirname + '/public/resources/adminEmployees.json');
    var callbackUrl = "/#!/employees";
    res.redirect(callbackUrl);
}

function uploadVendorOptions(req, res) {
    var tooltipConfig = JSON.parse(fs.readFileSync(__dirname + '/public/vendor-data/tooltip/' + req.body.vendorName + "_tooltip-config.json", 'utf8'));
    var futureFile = {};
    for (x in tooltipConfig) {
        var elt = {};
        var displayName = "display" + x;
        var viewName = "view" + x;
        var moneyName = "money" + x;
        elt[x] = {};
        if (req.body[displayName] !== undefined) {
            if (req.body[displayName] === 'on') {
                elt[x].display = true;
            }
        }
        else {
            elt[x].display = false;
        }
        if (req.body[viewName] !== undefined) {
            elt[x].view = req.body[viewName];
        }
        if (req.body[moneyName] !== undefined) {
            if (req.body[moneyName] === 'on') {
                elt[x].money = true;
            }
        }
        else {
            elt[x].money = false;

        }
        futureFile[x] = elt[x];

    }
    futureFile['operation'] = {
        "field1": req.body.field1,
        "operation": req.body.operation,
        "field2": req.body.field2,
        "format": req.body.operationFormat,
        "name": req.body.opName
    };

    //console.log(futureFile);
    fs.writeFile(__dirname + '/public/vendor-data/tooltip/' + req.body.vendorName + "_tooltip-config.json", JSON.stringify(futureFile));
    var callbackUrl = "/#!/vendor/" + req.body.vendorName;
    setTimeout(function () {
        res.redirect(callbackUrl);
    }, 1500);
}

function parseApprovalsReport() {
    var file = fs.readFileSync('./public/csv/approval_report.csv', 'utf8');
    var arr = CSV.parse(file);
    var finalArr = [['deptno', 'approval1', 'approval2', 'approval3', 'approval4', 'approval5', 'approval6', 'approval7', 'approval8', 'approval9', 'requestors']];
    arr.splice(0, 1);
    var departmentNumbers = [];
    for (record in arr) {
        var found = false;
        for (dept in departmentNumbers) {
            if (departmentNumbers[dept] == arr[record][0]) {
                found = true;
            }
        }
        if (!found) {
            var emptyArr = [arr[record][0], "", "", "", "", "", "", "", "", "", ""];
            departmentNumbers.push(arr[record][0]);
            finalArr.push(emptyArr);
        }
    }
    for (record in arr) {
        for (newRec in finalArr) {
            if (finalArr[newRec][0] == arr[record][0]) {
                if (finalArr[newRec][parseInt(arr[record][1])] == "") {
                    finalArr[newRec][parseInt(arr[record][1])] = finalArr[newRec][parseInt(arr[record][1])] + arr[record][2];
                }
                else {
                    finalArr[newRec][parseInt(arr[record][1])] = finalArr[newRec][parseInt(arr[record][1])] + " " + arr[record][2];
                }

            }
        }
    }
    for (var a = 1; a < finalArr.length; a++) {
        finalArr[a][9] = "FMCB"
    }
    var requestorsFile = fs.readFileSync('./public/csv/requestors.csv', 'utf8');
    var reqArr = CSV.parse(requestorsFile);
    reqArr.splice(0, 1);

    for (req in reqArr) {
        for (var record = 1; record < finalArr.length; record++) {
            if (finalArr[record][0] == reqArr[req][1] && finalArr[record][10] == "") {
                finalArr[record][10] = finalArr[record][10] + reqArr[req][0];
            }
            else if (finalArr[record][0] == reqArr[req][1] && finalArr[record][10] != "") {
                finalArr[record][10] = finalArr[record][10] + " " + reqArr[req][0];
            }
        }
    }
    fs.writeFile(__dirname + '/public/csv/new_approvals.csv', CSV.stringify(finalArr));

}


function treeInfoToJSON() {
    var structureFile = fs.readFileSync('./public/csv/PSTREENODE.csv', 'utf8');
    var namesFile = fs.readFileSync('./public/csv/DEPT_TBL.csv', 'utf8');
    var structure = CSV.parse(structureFile);
    var names = CSV.parse(namesFile);
    var finalOpsTree = {
        "name": "Chief Operating Officer",
        "level": "2",
        "deptno": "200000",
        "children": returnKids('200000')
    };
    var finalAdminTree = {
        "name": "General Manager",
        "level": "2",
        "deptno": "105000",
        "children": returnKids('105000')
    };

    function returnKids(deptNo) {
        var childArr = [];
        for (record in structure) {
            // if the parent = deptNo, and the parent isn't the GARBAGE node
            if (structure[record][3] === deptNo && deptNo !== '096011') {
                var n = "";
                //console.log(structure[record][1] + " is a child of " + deptNo);
                // attempts to find the name of the dept

                // the name = name
                n = nameMatch(structure[record][1]);
                // push onto the tree
                childArr.push({
                    "name": n,
                    "level": structure[record][2],
                    "deptno": structure[record][1],
                    "status": names[name][2],
                    // return children
                    "children": returnKids(structure[record][1])
                });
            }

        }


        return childArr;
    }

    function nameMatch(deptNo) {
        var returnName = "";
        for (name in names) {
            if (names[name][0] == deptNo) {
                returnName = names[name][1];
            }

        }
        return returnName;
    }

    fs.writeFileSync(__dirname + '/public/resources/operating.min.extra.json', JSON.stringify(finalOpsTree));
    fs.writeFileSync(__dirname + '/public/resources/admin.min.extra.json', JSON.stringify(finalAdminTree));

}


function uploadFileVendor(req, res) {
    var vendorName = req.body.vendorName;
    var deptNo = true;
    var year = false;
    var price = false;
    var quantity = false;
    var extra = 0;
    var field1 = "0";
    var operation = "0";
    var field2 = "0";
    var vars = [];
    if (req.body.year != undefined) {
        year = true;
    }
    if (req.body.price != undefined) {
        price = true;
    }
    if (req.body.quantity != undefined) {
        quantity = true;
    }
    if (req.body.extra != 0) {
        extra = req.body.extra;
    }
    if (req.body.field1 != undefined) {
        field1 = req.body.field1;
    }
    if (req.body.operation != undefined) {
        operation = req.body.operation;
    }
    if (req.body.field2 != undefined) {
        field2 = req.body.field2;
    }
    var f = {"name": "", "value": ""};
    if (req.body.var1 != undefined) {
        f = {"name": req.body.varDesc1, "value": req.body.var1};
        console.log(f);
        vars.push(f);
    }
    if (req.body.var2 != undefined) {
        f = {"name": req.body.varDesc2, "value": req.body.var2};
        vars.push(f);
    }
    if (req.body.var3 != undefined) {
        f = {"name": req.body.varDesc3, "value": req.body.var3};
        vars.push(f);
    }
    if (req.body.var4 != undefined) {
        f = {"name": req.body.varDesc4, "value": req.body.var4};
        vars.push(f);
    }
    if (req.body.var5 != undefined) {
        f = {"name": req.body.varDesc5, "value": req.body.var5};
        vars.push(f);
    }
    if (req.body.var6 != undefined) {
        f = {"name": req.body.varDesc6, "value": req.body.var6};
        vars.push(f);
    }
    if (req.body.var7 != undefined) {
        f = {"name": req.body.varDesc7, "value": req.body.var7};
        vars.push(f);
    }
    if (req.body.var8 != undefined) {
        f = {"name": req.body.varDesc8, "value": req.body.var8};
        vars.push(f);
    }
    if (req.body.var9 != undefined) {
        f = {"name": req.body.varDesc9, "value": req.body.var9};
        vars.push(f);
    }
    if (req.body.var10 != undefined) {
        f = {"name": req.body.varDesc10, "value": req.body.var10};
        vars.push(f);
    }
    var config = {
        "deptNo": deptNo,
        "year": year,
        "price": price,
        "quantity": quantity,
        "extra": extra,
        "field1": field1,
        "operation": operation,
        "field2": field2,
        "vars": vars
    };

    var myFile = req.file;
    var options = {};
    for (var p = 0; p < config.vars.length; p++) {
        options[config.vars[p].value] = {"display": true, "money": false, "view": "values"};
    }
    options['operation'] = {"field1": "0", "operation": "0", "field2": "0", "name": "Insert Name Here"};
    fs.rename(__dirname + '/public/uploads/' + myFile.filename, __dirname + '/public/vendor-data/' + vendorName + '.csv');
    fs.writeFile(__dirname + '/public/vendor-data/configuration/' + vendorName + "_config.json", JSON.stringify(config));
    fs.writeFile(__dirname + '/public/vendor-data/tooltip/' + vendorName + "_tooltip-config.json", JSON.stringify(options));

    var callbackUrl = "/#!/vendor/" + vendorName + "/options";
    setTimeout(function () {
        res.redirect(callbackUrl);

    }, 1000);
}

function uploadFileADepartments(req, res) {
    var myFile = req.file;
    fs.rename(__dirname + '/public/uploads/' + myFile.filename, __dirname + '/public/resources/flare_experiment_2.json');
    var callbackUrl = "/#!";
    res.redirect(callbackUrl);
}

function uploadFileODepartments(req, res) {
    var myFile = req.file;
    fs.rename(__dirname + '/public/uploads/' + myFile.filename, __dirname + '/public/resources/flare_experiment.json');
    var callbackUrl = "/#!";
    res.redirect(callbackUrl);
}

function uploadFileProcurement(req, res) {
    var myFile = req.file;
    csvJSON2(myFile.filename);
    var callbackUrl = "/#!/procurement";
    res.redirect(callbackUrl);
}

function uploadFile(req, res) {
    var myFile = req.file;
    csvJSON(myFile.filename);
    var callbackUrl = "/#!";
    res.redirect(callbackUrl);
}

function uploadFileKPI(req, res) {
    var myFile = req.file;
    fs.rename(__dirname + '/public/uploads/' + myFile.filename, __dirname + '/public/resources/kpitodept.json');
    var callbackUrl = "/#!/kpi";
    res.redirect(callbackUrl);
}

//var csv is the CSV file with headers
function csvJSON(csvName) {
    fs.rename(__dirname + '/public/uploads/' + csvName, __dirname + '/public/csv/budgetdata.csv');

}

function csvJSON2(csvName) {
    fs.rename(__dirname + '/public/uploads/' + csvName, __dirname + '/public/csv/procurementdata.csv');

}