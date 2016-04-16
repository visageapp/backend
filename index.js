var express     = require('express'),
    nodeEnvFile = require('node-env-file'),
    visa        = require('./utils/visa'),
    facebook    = require('./utils/facebook'),
    messenger   = require('./utils/messenger'),
    app         = express();

// Load Environment Variables
nodeEnvFile(__dirname + "/.env");

visa('/', {}, (err, res, data) => {
    console.log(err, res, data);
});

app.get("/api/v"+process.env.VERSION_NUMBER+"/fbHook", facebook);
app.post("/api/v"+process.env.VERSION_NUMBER+"/fbHook", messenger);

// Exposed HTTP Port
app.listen(process.env.PORT);
console.log("listening on port ", process.env.PORT);

module.exports = exports;
