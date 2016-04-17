var request = require('request'),
    m       = require('moment'), 
    webshot = require('webshot'),
    plaid   = require('plaid'),
    chase   = "5301a99504977c52b60000d0", //chase bank instution code
    P       = new plaid.Client('571283b266710877408cff7f', 'ed8be9bcb8ff937843385919c6341a', plaid.environments.tartan);

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
        render(`$${acct.balance.available}`, `${acct.meta.name}`, acct._id);
          return {
            img: `http://10.24.194.64:8888/${acct._id}.png`,
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
  stats(cb){
    P.getConnectUser(token, (err, data) => {
        var recent = data.transactions
                        .filter(t => m(t.date).isSameOrAfter('2016-3-1', 'month'));

        cb(err, {
            earned: recent.filter(t => t.amount < 0)
                    .map(t => t.amount)
                    .reduce((p, n) => p + n),
            spent: recent.filter(t => t.amount > 0)
                    .map(t => t.amount)
                    .reduce((p, n) => p + n),
            burn: recent
                    .filter(t => t.amount > 0)
                    .sort((a, b) => {
                        if (a.amount > b.amount) {
                            return 1;
                          }
                          if (a.amount < b.amount) {
                            return -1;
                          }
                          return 0;
                    }).pop()

        });
    });
  },
  render
}

function render(top, sub, id, cb){
    var t = Date.now();
    return webshot(`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <script src="https://use.typekit.net/pge2pdn.js"></script>
                <script>try{Typekit.load({ async: true });}catch(e){}</script>
                <style>
                    html, body {
                        margin: 0;
                        padding: 0;
                        width: 100vw;
                        height: 100vh;
                        overflow: hidden;
                        text-align: center;
                        align-items: center;
                        flex-direction: column;
                        justify-content: center;
                        background: #2980b9; //#34495e;
                    }

                    .top{
                        margin-top: 15%;
                        font-size: 9em;
                        text-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
                    }
                        
                    h1, h2, h3, h4, h5, h6, p {
                        font-family: "brandon-grotesque",sans-serif;
                        font-weight: 100;
                        color:  #f5f5f5;//#29AAE2 //#444;
                        z-index: -2;
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                        justify-content: center;
                    }
                </style>
                <title>Visage</title>
            </head>
            <body>
                <h1 class="top">${top || 'Visage'}</h1>
                <h3>${sub || 'The Intelligent Finance Messenger'}</h3>
            </body>
        </html>
    `, 
        `./public/imgs/${id || t}.png`,
        {
            siteType:'html',
            screenSize: 
                {width: 916, 
                height: 480}, 
            shotSize: 
                {width: 916, 
                height: 480}, 
            userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
        }, err => {
           cb && cb(err || `./public/imgs/${id || t}.png`);
        });
  }
