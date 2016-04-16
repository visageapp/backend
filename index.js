var express     = require('express'),
    bodyParser = require('body-parser'),
    nodeEnvFile = require('node-env-file'),
    app         = express();

// Load Environment Variables
nodeEnvFile(__dirname + "/.env");

//Configure Express Server
app.use(bodyParser.urlencoded({extended: false}))

//Setup Application Routes
require('./api/routes')(app)

// Exposed HTTP Port
app.listen(process.env.PORT, () => {
    console.log(`Visage up on: http://localhost:${process.env.PORT}`)
});

module.exports = exports;
