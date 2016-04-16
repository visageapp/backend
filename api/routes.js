var c = require('./controllers');

module.exports = function(app){
    app.get('/', (req, res) => res.json({status: 200, message: 'Api is up :)'}));

    app.get('/seed', c.UserController.seed);
    app.get('/visa', c.VisaController.index);
}
