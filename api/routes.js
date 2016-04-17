var c = require('./controllers');

module.exports = function(app){
    app.get('/test', c.BankController.test);
    
    app.get('/visa', c.BankController.connect_card);
    app.post('/connect', c.BankController.connect_bank);
    app.post('/validate', c.BankController.validate);
    app.get('/balance', c.BankController.balance);
    app.get('/income', c.BankController.income);
    app.get('/status', c.BankController.status);

}
