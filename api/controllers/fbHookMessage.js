var request = require('request');
var User = require('../models/User')
var aiResponse = require('../utils/aiResponse');
var accounts = require('../utils/plaid');
var visa = require('../utils/visa');

var stepSession = {
    currentFlow: null,
    stepMeta: {}
};

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:process.env.FB_PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

function sendStructuredMessage(sender, entities) {
    var json = {
        recipient: {id:sender},
        "message":{
            "attachment":{
              "type":"template",
              "payload":{
                "template_type":"generic",
                "elements": entities.map((entity) => {
                    console.log(entity);
                    return {
                        title: entity.balance || 'N/A',
                        subtitle: entity.meta.name,
                        image_url: entity.img
                    }
                })
              }
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:process.env.FB_PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: json
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

function handleShowCards(sender, text) {
    visa.get().then(resp => {
        accounts.render(resp.body.cardProductName,
                        "Issued by: " +resp.body.issuerName,
                        Date.now(),
        function(path) {
            console.log(resp.body);
            console.log(sender);
            var entity = [
                {
                    balance: resp.body.cardProductName,
                    meta: {
                        name: resp.body.issuerName,
                    },
                    img: `http://192.168.110.1:8888/${sender}.png`,
                }
            ];
            sendStructuredMessage(sender, entity);
        });

        res.sendStatus(200);
    }, err => res.json(err));
}

function handleAccountReq(sender, text) {
    accounts.getBalance((err, balance) => {
        // console.log(err);
        console.log(balance);
        sendStructuredMessage(sender, balance);
    });
}

function handleSetLimit(sender, text) {
    visa.restrict(450).then((res) => {
        sendTextMessage(sender, "Awesome! I've set your spending limit to $450" )
    });
}

function sendUserNotFound(sender) {
    sendTextMessage(sender, `Hi there! It looks like you haven't authorized your card with us yet. Set one up at http://visage.ngrok.io`);
}

/**
* Handles requests for new Facebook Page messages
* @param {Object} req - Express Request Object that has the new Facebook
*   Page message payload
* @param {Object} res - Express Response Object
*/
function fbHookMessage(req, res) {
    var messaging_events = req.body.entry[0].messaging;
    for (var i = 0; i < messaging_events.length; i++) {
        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;
        console.log(sender);
        if(event.optin || sender == '855686287892510') {
            var userId = event.sender.id;
            User.create({messenger_id: userId}).then(id => console.log(id));
        }
        if (event.message && event.message.text) {
            User.findByMessenger(sender)
            .then((row) => {
                console.log("ROW: "+row);
                // if(!row) { sendUserNotFound(sender); }
                // else {
                    var text = event.message.text;
                    if(text.toLowerCase().indexOf("account") > -1) {
                        handleAccountReq(sender, text);
                    }
                    else if(text.toLowerCase().indexOf("show") > -1 &&
                            text.toLowerCase().indexOf("cards") > -1) {
                        handleShowCards(sender, text);
                    }
                    else if(text.toLowerCase().indexOf("limit") > -1) {
                        handleSetLimit(sender, text);
                    }
                    else if(text.toLowerCase().indexOf("create goal") > -1) {
                        sendTextMessage(sender, "What is your goal?")
                        // handleCreateGoal()
                    }
                    else {
                        aiResponse(sender, text).then(message => {
                            sendTextMessage(sender, message);
                        });
                    }
                // }
            }, (err) => { console.log("REJECT: ",err); });
        }
    }
    res.sendStatus(200);
}

module.exports = exports = fbHookMessage;
