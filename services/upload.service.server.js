var app = require('../express');

var multer = require('multer'); // npm install multer --save
var upload = multer({dest: __dirname + '/../public/uploads'});

app.post("/api/upload/image", upload.single('myFile'), uploadFile);
app.post("/api/upload/p", upload.single('myFile'), uploadPFile);
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