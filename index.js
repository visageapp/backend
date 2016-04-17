var express     = require('express'),
    bodyParser = require('body-parser'),
    nodeEnvFile = require('node-env-file'),
    app         = express();

// Load Environment Variables
nodeEnvFile(__dirname + "/.env");

//Configure Express Server
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//Setup Application Routes
require('./api/routes')(app)

// Exposed HTTP Port
app.listen(process.env.PORT, () => {
    console.log(`Visage listening on port ${process.env.PORT}`)
});

module.exports = exports;
