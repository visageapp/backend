var express     = require('express'),
    nodeEnvFile = require('node-env-file'),
    hello       = require('./hello');
    app         = express();

// Load Environment Variables
nodeEnvFile(__dirname + "/.env");

// Exposed HTTP Port
app.listen(process.env.PORT);

module.exports = exports;
