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
        if (event.message && event.message.text) {
            var text = event.message.text;
            console.log(text);
        }
    }
    res.sendStatus(200);
}

module.exports = exports = fbHookMessage;