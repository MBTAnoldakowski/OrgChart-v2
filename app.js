console.log("SERVER SIDE!");
var app = require('express'); // creates an instance of the express lib
//var myModule = angular.module('OrgApp', []);
var mongoose = require('mongoose');
var underscore = require('underscore');
var connectionString = 'mongodb://localhost/BUDGET-DATA';
if (process.env.MLAB_USERNAME_WEBDEV) {
    console.log("on heroku!");
    connectionString = process.env.MLAB_USERNAME_WEBDEV + ":" +
        process.env.MLAB_PASSWORD_WEBDEV + "@ds135444.mlab.com:35444/heroku_829kjs4t"
}

if (process.env.MLAB_USERNAME) { // check if running remotely
    connectionString = process.env.MLAB_USERNAME_WEBDEV + ":" +
        process.env.MLAB_PASSWORD_WEBDEV + "@ds135444.mlab.com:35444/heroku_829kjs4t"
}
console.log("connecting with: " + connectionString);

mongoose.connect(connectionString);

require('./services/budget.service.server');

require('./services/upload.service.server');
