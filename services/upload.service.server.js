var app = require('../express');

var multer = require('multer'); // npm install multer --save
var upload = multer({dest: __dirname + '/../public/uploads'});

app.post("/api/upload/image", upload.single('myFile'), uploadFile);
app.post("/api/upload/p", upload.single('myFile'), uploadPFile);
app.post("/api/upload/odepartments", upload.single('myFile'), uploadODFile);
app.post("/api/upload/adepartments", upload.single('myFile'), uploadADFile);
app.post("/api/upload/oemployees", upload.single('myFile'), uploadOEFile);
app.post("/api/upload/aemployees", upload.single('myFile'), uploadAEFile);
console.log('server upload');

function uploadFile(req, res) {
    console.log('uploading');
    var myFile = req.file;
    var currentdate = new Date();
    var filename = "" + currentdate.getDate() + "."
        + (currentdate.getMonth() + 1) + "."
        + currentdate.getFullYear() + "_"
        + currentdate.getHours() + "."
        + currentdate.getMinutes() + "."
        + currentdate.getSeconds();
    var path = myFile.path;         // full path of uploaded file
    var destination = myFile.destination;  // folder where file is saved to
    var size = myFile.size;
    var mimetype = myFile.mimetype;

    console.log(myFile);
    var callbackUrl = "/#!";
    console.log(callbackUrl);
    res.redirect(callbackUrl);
}


function uploadPFile(req, res) {
    console.log('uploading');
    var myFile = req.file;
    var currentdate = new Date();
    var filename = "" + currentdate.getDate() + "."
        + (currentdate.getMonth() + 1) + "."
        + currentdate.getFullYear() + "_"
        + currentdate.getHours() + "."
        + currentdate.getMinutes() + "."
        + currentdate.getSeconds();
    var path = myFile.path;         // full path of uploaded file
    var destination = myFile.destination;  // folder where file is saved to
    var size = myFile.size;
    var mimetype = myFile.mimetype;

    console.log(myFile);
    var callbackUrl = "/#!";
    console.log(callbackUrl);
    res.redirect(callbackUrl);
}
function uploadODFile(req, res) {
    console.log('uploading');
    var myFile = req.file;
    var currentdate = new Date();
    var filename = "" + currentdate.getDate() + "."
        + (currentdate.getMonth() + 1) + "."
        + currentdate.getFullYear() + "_"
        + currentdate.getHours() + "."
        + currentdate.getMinutes() + "."
        + currentdate.getSeconds();
    var path = myFile.path;         // full path of uploaded file
    var destination = myFile.destination;  // folder where file is saved to
    var size = myFile.size;
    var mimetype = myFile.mimetype;

    console.log(myFile);
    var callbackUrl = "/#!";
    console.log(callbackUrl);
    res.redirect(callbackUrl);
}

function uploadADFile(req, res) {
    console.log('uploading');
    var myFile = req.file;
    var currentdate = new Date();
    var filename = "" + currentdate.getDate() + "."
        + (currentdate.getMonth() + 1) + "."
        + currentdate.getFullYear() + "_"
        + currentdate.getHours() + "."
        + currentdate.getMinutes() + "."
        + currentdate.getSeconds();
    var path = myFile.path;         // full path of uploaded file
    var destination = myFile.destination;  // folder where file is saved to
    var size = myFile.size;
    var mimetype = myFile.mimetype;

    console.log(myFile);
    var callbackUrl = "/#!";
    console.log(callbackUrl);
    res.redirect(callbackUrl);
}

function uploadOEFile(req, res) {
    console.log('uploading');
    var myFile = req.file;
    var currentdate = new Date();
    var filename = "" + currentdate.getDate() + "."
        + (currentdate.getMonth() + 1) + "."
        + currentdate.getFullYear() + "_"
        + currentdate.getHours() + "."
        + currentdate.getMinutes() + "."
        + currentdate.getSeconds();
    var path = myFile.path;         // full path of uploaded file
    var destination = myFile.destination;  // folder where file is saved to
    var size = myFile.size;
    var mimetype = myFile.mimetype;

    console.log(myFile);
    var callbackUrl = "/#!";
    console.log(callbackUrl);
    res.redirect(callbackUrl);
}

function uploadAEFile(req, res) {
    console.log('uploading');
    var myFile = req.file;
    var currentdate = new Date();
    var filename = "" + currentdate.getDate() + "."
        + (currentdate.getMonth() + 1) + "."
        + currentdate.getFullYear() + "_"
        + currentdate.getHours() + "."
        + currentdate.getMinutes() + "."
        + currentdate.getSeconds();
    var path = myFile.path;         // full path of uploaded file
    var destination = myFile.destination;  // folder where file is saved to
    var size = myFile.size;
    var mimetype = myFile.mimetype;

    console.log(myFile);
    var callbackUrl = "/#!";
    console.log(callbackUrl);
    res.redirect(callbackUrl);
}