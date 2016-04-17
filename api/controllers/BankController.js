var visa    = require('../utils/visa'),
    plaid   = require('../utils/plaid');

module.exports = {
    connect_card(req, res){
        visa('vctc/customerrules/v1/consumertransactioncontrols', 
            {'primaryAccountNumber': '4667596775551010'},
            {userid: "21V9YG3XNSWPKKZCIUNY21ON3uFeCZC0hGuchwo4KxwLjoAFQ", 
            password: "lMkAbcAMAbEFfNhkNO3ZM"})
        .then(function (stuff) { console.log(stuff); res.json(stuff); }, 
            function (error) { console.log(error); });
    },
    connect_bank(req, res){
        plaid.createUser(null, null, req.body || req.parmas, (err, data) => {
            res.json(data);
        });
    },
    validate(req, res){
        plaid.createUser(
            req.body.token || req.query.token, 
            req.body.key || req.query.key, 
            null,
            (err, data) => {
              res.json( err || data);
            });
    },
    balance(req, res){
        plaid.getBalance((err, data) => {
            res.json(err || data);
        });
    },
    income(req, res){
        plaid.getIncome((err, data) => {
            res.json(err || data);
        });
    },
    status(req, res){
        plaid.risks((err, data) => {
            res.json(err || data);
        });
    },
    test(req, res){
        plaid.render(img => {
            res.json({img});
        });
    }

    //set cap
    //get notifications
}
