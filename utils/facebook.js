function facebook(req, res) {
    if (req.query['hub.verify_token'] === process.env.FB_VERITY_TOKEN) {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
}

module.exports = exports = facebook;
