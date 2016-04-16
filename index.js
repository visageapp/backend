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
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods',
                  'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 
                  'X-Requested-With, content-type, authorization, ' + 
                  'accept, origin');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
		
	if (req.method === "OPTIONS") {
        res.status(200).json({
            status: 200,
            message: "ok",
            data: {}
        });
	} else {
		next();	
	}
});

// Routes
app.get("/api/v" + process.env.VERSION_NUMBER + "/fbHook", facebook);
app.post("/api/v" + process.env.VERSION_NUMBER + "/fbHook", messenger);

// Exposed HTTP Port
app.listen(process.env.PORT, () => {
    console.log(`Visage listening on port ${process.env.PORT}`);
});

module.exports = exports;
