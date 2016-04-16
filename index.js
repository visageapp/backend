var express     = require('express'),
    nodeEnvFile = require('node-env-file'),
    visa        = require('./utils/visa'),
    app         = express();

// Load Environment Variables
nodeEnvFile(__dirname + "/.env");

visa('/', {}, (err, res, data) => {
    console.log(err, res, data);
});

// Exposed HTTP Port
app.listen(process.env.PORT);

module.exports = exports;
