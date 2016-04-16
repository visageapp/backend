var request     = require('request'),
    http        = request.defaults(),
    email       = 'jalvarado91@gmail.com',
    password    = 'VisageApp1';

module.exports = (uri, payload, cb) => {
    http.post({
        uri : `https://sandbox.api.visa.com/${uri}`,
        key: fs.readFileSync(`${__dirname}/../keys/visa_private.pem`),
        cert: fs.readFileSync(`${__dirname}/../keys/visa_certificate.pem`),
        headers: {
          'Content-Type' : 'application/json',
          'Accept' : 'application/json',
          'Authorization' : 'Basic ' + new Buffer(`${emial}:${password}`).toString('base64')
        },
        body: payload
      }, cb);
};
