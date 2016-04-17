var c = require('./controllers');

module.exports = function(app){
    //serviing sattic images from messenger slideshow
    app.use(express.static('./utils/tmp'));

    app.get('/', (req, res) => res.json({status: 200, message: 'Api is up :)'}));
    app.get('/seed', c.UserController.seed);

    app.get('/test', c.BankController.test);
    
    app.get('/visa', c.BankController.index);
    app.post('/connect', c.BankController.connect_bank);
    app.post('/validate', c.BankController.validate);
    app.get('/balance', c.BankController.balance);
    app.get('/income', c.BankController.income);
    app.get('/status', c.BankController.status);

}
