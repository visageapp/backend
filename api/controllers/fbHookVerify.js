/**
* Handles requests to verify Facebook hook - this is done by Facebook
* @param {Object} req - Express Request Object that has query payloads 
*   of hub.verify_token and hub.challenge
* @param {Object} res - Express Response Object
*/
function fbHookVerify(req, res) {
    if (req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
        res.status(200).send(req.query['hub.challenge']);
    }
    res.status(400).send('Error, wrong validation token');
}

module.exports = exports = fbHookVerify;