var fs          = require('fs'),
    request     = require('request'),
    env         = process.env,
    http        = request.defaults({
        key: fs.readFileSync(`${__dirname}/../keys/visa_private.pem`),
        cert: fs.readFileSync(`${__dirname}/../keys/visa_certificate.pem`),
        headers: {
          'Content-Type' : 'application/json',
          'Accept' : 'application/json',
          'Authorization' : 'Basic ' + new Buffer(`${env.VISA_EMAIL}:${env.VISA_PASSWORD}`).toString('base64')
        },
    });

module.exports = (uri, payload, cb) => {
    http.post(`https://sandbox.api.visa.com/${uri}`, payload, cb);
};
