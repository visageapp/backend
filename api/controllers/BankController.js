var visa    = require('../utils/visa'),
    plaid   = require('../utils/plaid'),
    card    = '5712664de4b0fe37deb360c2';

module.exports = {
    connect_card(req, res){
        visa('vctc/customerrules/v1/consumertransactioncontrols',
            {'primaryAccountNumber': '4667596775551010'},
            {userid: "21V9YG3XNSWPKKZCIUNY21ON3uFeCZC0hGuchwo4KxwLjoAFQ",
            password: "lMkAbcAMAbEFfNhkNO3ZM"})
        .then(resp => res.json(resp.body), err => res.json(err));
    },
    get_card(req, res){
        visa('paai/generalattinq/v1/cardattributes/generalinquiry',
            {'primaryAccountNumber': '4667596775551010'},
            {userid: "21V9YG3XNSWPKKZCIUNY21ON3uFeCZC0hGuchwo4KxwLjoAFQ",
            password: "lMkAbcAMAbEFfNhkNO3ZM"})
        .then(resp => res.json(resp.body), err => res.json(err));
    },
    secure_card(req, res){
        visa(`vctc/customerrules/v1/consumertransactioncontrols/${card}/rules`,
            {
                "globalControl": {
                    "alertThreshold": 500, //value
                    "declineThreshold": 600, //value
                    "isControlEnabled": true,
                    "shouldAlertOnDecline": true,
                    "shouldDeclineAll": true,
                    "shouldTargetSpecificCard": true,
                    "userIdentifier": "string"
                  },
                  "transactionControls": [
                    {
                      "alertThreshold": 150, //value
                      "controlType": "TCT_AUTO_PAY",
                      "declineThreshold": 400, //value
                      "isControlEnabled": true,
                      "shouldAlertOnDecline": true,
                      "shouldDeclineAll": true,
                      "shouldTargetSpecificCard": true,
                      "userIdentifier": "string"
                    }
                  ]
            },
            {userid: "21V9YG3XNSWPKKZCIUNY21ON3uFeCZC0hGuchwo4KxwLjoAFQ",
            password: "lMkAbcAMAbEFfNhkNO3ZM"})
        .then(resp => res.json(resp.body), err => res.json(err));
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
        visa(`vctc/customerrules/v1/consumertransactioncontrols/${card}/rules`,
            {
                "globalControl": {
                    "alertThreshold": 500,
                    "declineThreshold": 500,
                    "isControlEnabled": true,
                    "shouldAlertOnDecline": true,
                    "shouldDeclineAll": false,
                    "shouldTargetSpecificCard": true,
                  },
                  "transactionControls": [
                    {
                      "alertThreshold": 150,
                      "controlType": "TCT_AUTO_PAY",
                      "declineThreshold": 400,
                      "isControlEnabled": true,
                      "shouldAlertOnDecline": true,
                      "shouldDeclineAll": false,
                      "shouldTargetSpecificCard": true,
                    }
                  ]
            },
            {userid: "21V9YG3XNSWPKKZCIUNY21ON3uFeCZC0hGuchwo4KxwLjoAFQ",
            password: "lMkAbcAMAbEFfNhkNO3ZM"})
        .then(resp => res.json(resp.body), err => res.json(err));
    }

    //set cap
    //get notifications
}
