var express     = require('express'),
    bodyParser = require('body-parser'),
    nodeEnvFile = require('node-env-file'),
    visa        = require('./utils/visa'),
    facebook    = require('./utils/facebook'),
    messenger   = require('./utils/messenger'),
    app         = express();

// Load Environment Variables
nodeEnvFile(__dirname + "/.env");

//Configure Express Server
app.use(bodyParser.urlencoded({extended: false}))

//Setup Application Routes
require('./api/routes')(app)

app.get("/api/v"+process.env.VERSION_NUMBER+"/fbHook", facebook);
app.post("/api/v"+process.env.VERSION_NUMBER+"/fbHook", messenger);

// Exposed HTTP Port
app.listen(process.env.PORT, () => {
    console.log(`Visage listening on port ${process.env.PORT}`)
});

module.exports = exports;
