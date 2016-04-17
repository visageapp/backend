var express = require('express'),
    bodyParser = require('body-parser'),
    nodeEnvFile = require('node-env-file'),
    fbHookVerify = require('./api/controllers/fbHookVerify'),
    fbHookMessage = require('./api/controllers/fbHookMessage'),
    User = require('./api/models/User'),
    app = express();

// Load Environment Variables
nodeEnvFile(__dirname + "/.env");

//Configure Express Server
app.use(express.static(`${__dirname}/tmp`));
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
app.use(express.static(__dirname + './static'));

app.get("/api/v" + process.env.VERSION_NUMBER + "/startDb", (req, res) => {
    User.seed();
    res.json({msg: "Done son"});
});

// Routes
app.get("/api/v" + process.env.VERSION_NUMBER + "/fbHook",
        fbHookVerify);
app.post("/api/v" + process.env.VERSION_NUMBER + "/fbHook",
         fbHookMessage);

require('./api/routes')(app);

// Exposed HTTP Port
app.listen(process.env.PORT, () => {
    console.log(`Visage listening on port ${process.env.PORT}`);
});

module.exports = exports;
