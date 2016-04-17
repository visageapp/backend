var request = require('request');
var User = require('../models/User')
var aiResponse = require('../utils/aiResponse');
var accounts = require('../utils/plaid');

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
                    return {
                        title: '$'+entity.balance,
                        subtitle: entity.meta.name,
                        image_url: 'http://unsplash.it/916/480'
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

function handleAccountReq(sender, text) {
    accounts.getBalance((err, balance) => {
        console.log(err);
        console.log(balance);
        sendStructuredMessage(sender, balance);
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
        if(event.optin) {
            var userId = event.sender.id;
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
                    if(text.toLowerCase().indexOf("create goal") > -1) {
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
