var request = require('request');
var User = require('../api/models/')

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

function messenger(req, res) {
    var messaging_events = req.body.entry[0].messaging;
    for (var i = 0; i < messaging_events.length; i++) {
        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;

        User.findByMessenger(sender, function(){

        });


        if (event.message && event.message.text) {
            var text = event.message.text;
            sendTextMessage(sender, "No, "+ text.substring(0, 200));
            console.log(text);
        }
    }
    res.sendStatus(200);
}

module.exports = exports = messenger;
