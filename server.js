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

// pulls the files from the server, deletes the first line of the file
function pullFromFTP() {
    client.scp({
        host: 'mbtaftp.mbta.com',
        username: 'mbtadotcom',
        port: 10022,
        password: process.env.ftp_password,
        path: './DEPT_TBL.csv'
    }, './public/csv/', function (err) {
        if (err) {
            console.log("rut roe, there's been an error: " + err);
        }
    });
    client.scp({
        host: 'mbtaftp.mbta.com',
        username: 'mbtadotcom',
        port: 10022,
        password: process.env.ftp_password,
        path: './approval_report.csv'
    }, './public/csv/', function (err) {
        if (err) {
            console.log("rut roe, there's been an error: " + err);
        }
    });
    client.scp({
        host: 'mbtaftp.mbta.com',
        username: 'mbtadotcom',
        port: 10022,
        password: process.env.ftp_password,
        path: './budgetdata.csv'
    }, './public/csv/', function (err) {
        if (err) {
            console.log("rut roe, there's been an error: " + err);
        }
    });
    client.scp({
        host: 'mbtaftp.mbta.com',
        username: 'mbtadotcom',
        port: 10022,
        password: process.env.ftp_password,
        path: './requestors.csv'
    }, './public/csv/', function (err) {
        if (err) {
            console.log("rut roe, there's been an error: " + err);
        }
    });
    client.scp({
        host: 'mbtaftp.mbta.com',
        username: 'mbtadotcom',
        port: 10022,
        password: process.env.ftp_password,
        path: './PSTREENODE.csv'
    }, './public/csv/', function (err) {
        if (err) {
            console.log("rut roe, there's been an error: " + err);
        }
    });
    client.scp({
        host: 'mbtaftp.mbta.com',
        username: 'mbtadotcom',
        port: 10022,
        password: process.env.ftp_password,
        path: './procurementdata.csv'
    }, './public/csv/', function (err) {
        if (err) {
            console.log("rut roe, there's been an error: " + err);
        }
    });
}

function removeVendor(req, res) {
    var vendorName = req.body;
    console.log('removing vendor');
}

function uploadFileOEmployees(req, res) {
    var myFile = req.file;
    fs.rename(__dirname + '/public/uploads/' + myFile.filename, __dirname + '/public/resources/operatingEmployees.json');
    var callbackUrl = "/#!/employees";
    res.redirect(callbackUrl);
}

function uploadIcon(req, res) {
    console.log(req.body.selectedCat);
    var myFile = req.file;
    var fileName = req.body.selectedCat + ".png";
    fs.rename(__dirname + '/public/uploads/' + myFile.filename, __dirname + '/public/resources/icons/' + fileName);
    var callbackUrl = "/#!/categories";
    res.redirect(callbackUrl);
}

function updateCats(req, res) {
    var myFile = JSON.stringify(req.body);
    fs.writeFile("./public/resources/cats.json", myFile);
    var callbackUrl = "/#!/categories";
    res.redirect(callbackUrl);
}

function getFiles(req, res) {
    var files = fs.readdirSync(__dirname + '/public/vendor-data');
    res.send(files);
}

function getCategories(req, res) {
    var file = JSON.parse(fs.readFileSync('./public/resources/cats.json', 'utf8'));
    res.send(file);
}


function getOSDCategories(req, res) {
    var url = 'http://www.mass.gov/anf/budget-taxes-and-procurement/procurement-info-and-res/buy-from-a-state-contract/statewide-contract-user-guides.html';
    var date = new Date();
    var finalJSON = {
        "date-pulled": (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear(),
        "children": []
    };
    console.log(finalJSON);
    request(url, function (error, response, html) {
        var $ = cheerio.load(html);
        var codeArray = [];
        var links = $('.bodyfield');
        $(links).each(function (i, link) {
            contracts = $(link).find('strong a').text();
        });
        var regEx = new RegExp('[A-Z]{3} - ');
        descriptions = contracts.split(regEx);
        descriptions.splice(0, 1);
        var regEx2 = new RegExp(' - ');
        codes = contracts.split(regEx2);
        codes = codes.map(function (e) {
            e = e.slice(-3);
            codeArray.push(e);
        });
        //console.log(descriptions);
        var finalCodes = [];
        for (code in codeArray) {
            if (codeArray[code].toUpperCase() == codeArray[code]) {
                finalCodes.push(codeArray[code]);
            }
        }
        finalCodes.push("Misc");
        descriptions.push("Miscellaneous");
        //console.log(finalCodes);
        for (description in descriptions) {
            finalJSON.children.push({
                "code": finalCodes[description],
                "name": descriptions[description],
                "isParent": true,
                "_children": []
            });
        }
        var contractNames = $('.col .callout .lead_snippet .titlelink');
        var contractDesc = $('.col .callout p').text();
        var unlinkedContracts = $('.col .callout p strong');
        var othersString = unlinkedContracts.text();
        othersString = othersString.replace(/Back to Top/g, '');
        var otherStrings = othersString.replace(/OSC/g, 'OSC ');
        otherStrings = otherStrings.split(new RegExp('([A-Z]{3}[0-9]+[^]*?)'));

        contractDesc = contractDesc.split(new RegExp('Back to Top'));
        $(contractNames).each(function (i, link) {
            var found = false;
            var cn = $(link).text();
            cn = cn.replace(/\s/g, '');
            var link = "http://www.mass.gov" + $(link).attr('href');
            // find description here
            var cname = {"code": cn, "link": link, "name": ""};
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
        otherStrings.shift();
        console.log(otherStrings);
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
        for (con in contractDesc) {
            if (contractDesc[con].replace(/\s/g, '').length > 0) {
                var codescstring = myTrim(contractDesc[con]);
                var desc = [];
                desc = codescstring.split(new RegExp("([A-Z]{3}[0-9]+[^@]*?-)"));
                for (var d = 0; d < desc.length; d++) {
                    if (desc[d].replace(/\s/g, '').length > 0) {
                        if (d % 2 === 1) {
                            var found = false;
                            var codeName = desc[d];
                            codeName = codeName.replace('-', '');
                            codeName = codeName.replace('file size 1MB', '');
                            codeName = codeName.replace(/\s/g, '');
                            //console.log(codeName);
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
                // validDesc.push(myTrim(contractDesc[con]));
            }
        }

        function myTrim(x) {
            return x.replace(/^\s+|\s+$/gm, '');
        }

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