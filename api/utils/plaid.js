var request = require('request'),
    webshot = require('webshot'),
    plaid   = require('plaid'),
    chase   = "5301a99504977c52b60000d0", //chase bank instution code
    P       = new plaid.Client(process.env.PLAID_CLIENTID, process.env.PLAID_SECRET, plaid.environments.tartan);

var token = '42092ed7e3614dfcaa4c42d8f7142acb7d2f27f2e9fea1180a165629f1f426808fa1054a6621fa2a041cdd844569b3d4f404d68a1b42373ed67537f4f053f799d3d6037ae7841b1383b85b9d565a4bdf';

module.exports = {
  //exchanges public_token from client into an access token
  //that can be used on the backend to create authenticated calls
  authenticate(public_token){
    P.exchangeToken(public_token, cb);
  },
  //this method might be replaced but creates Plaid user object
  //allowing use to query a users financial data
  createUser(token, key, user, cb){
    if(token && key) {
      P.stepConnectUser(token, key, function(err, mfaRes, res) {
        cb(err, mfaRes, res);
      });
    } else {
      P.addConnectUser('chase', user, {list: true}, (err, data) => {
        P.stepConnectUser(data.access_token, null, {
          send_method: data.mfa[1]
        }, cb);
      });
    }
  },
  /** Returns authenticated users account(s) information and transaction(s) info
  * @accounts []
  * @transactions []
  */
  getUser(cb){
    P.getConnectUser(token, cb);
  },
  /** Returns authenticated users account(s) balance
  */
  getBalance(cb){
    P.getBalance(token, (err, data) => {
      var balance = data.accounts.map(acct => {
          return {
            bank: acct.institution_type,
            meta: acct.meta,
            balance: acct.balance.available
          };
      })

      cb(err, balance);
    });
  },
  getIncome(cb){
    P.getConnectUser(token, (err, data) => {
      cb(err, 
        data.transactions
          .map(t => {
            return {
              amount: t.amount,
              date: t.date,
              name: t.name,
              category: t.category
            }
          })
          .filter(t => t.amount < 0))
    });
  },
  risks(cb){
    P.getRiskUser(token, cb)
  },
  render(cb){
    webshot(`<html><body><h1>Total: 841.52</h1></body></html>`, 
        './tmp/hello_world.png', 
        {siteType:'html'}, err => {
            cb(`.tmp/hello_world.png`);
        });
  }
}
