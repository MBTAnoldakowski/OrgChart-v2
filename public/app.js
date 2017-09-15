console.log("SERVER SIDE!");
var app = require('../express'); // creates an instance of the express lib
var mongoose = require('mongoose');
var connectionString = 'mongodb://127.0.0.1:27017/webdev_noldakowski';
if (process.env.MLAB_USERNAME_WEBDEV) {
    connectionString = process.env.MLAB_USERNAME_WEBDEV + ":" +
        process.env.MLAB_PASSWORD_WEBDEV + "@" +
        process.env.MLAB_HOST + ':' +
        process.env.MLAB_PORT + '/' +
        process.env.MLAB_APP_NAME;
}

var connectionString = 'mongodb://127.0.0.1:27017/test'; // for local
if (process.env.MLAB_USERNAME_WEBDEV) { // check if running remotely
    var username = process.env.MLAB_USERNAME_WEBDEV; // get from environment
    var password = process.env.MLAB_PASSWORD_WEBDEV;
    connectionString = 'mongodb://' + username + ':' + password;
    connectionString += 'ds135444.mlab.com:35444/heroku_829kjs4t'; // user yours
}
mongoose.connect(connectionString);

