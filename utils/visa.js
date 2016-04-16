var request = require('request'),
    fsPromise = require('fs-promise'), 
    path = require('path');

/**
* Helper util for calling the Visa API.
* @param {Object} userDetails - {userid, password}
* @param {Object|?} payload - Payload to send to Visa API
* @returns {Promise} Resolve on success, Rejected otherwise
*/
function visa(apiPath, userDetails, payload) {

    return fsPromise
        .readFile(`${__dirname}/../keys/visa_private.pem`)
        .then((privateContents) => {
        return fsPromise
            .readFile(`${__dirname}/../keys/visa_certificate.pem`)
            .then((certificateContents) => {
                return {
                    privateContents,
                    certificateContents
                };
            });
        })
        .then((contents) => {
            function promiseExecutor(resolve, reject) {
                var userId = userDetails.userid,
                    userPass = userDetails.password, 
                    privateContents = contents.privateContents,
                    certificateContents = contents.certificateContents;

                request.post({
                    url : `https://sandbox.api.visa.com/${apiPath}`,
                    key: privateContents,
                    cert: certificateContents,
                    headers: {
                        'Content-Type' : 'application/json',
                        'Accept' : 'application/json',
                        'Authorization' : 'Basic ' + 
                        (new Buffer(`${userId}:${userPass}`))
                        .toString('base64')
                    },
                    body: JSON.stringify(payload)
                }, (err, httpResponse, body) => {
                    if (err) {
                        reject(err);
                    }
                    resolve({
                        httpResponse,
                        body
                    });
                });
            }
            return new Promise(promiseExecutor);
        });
}

module.exports = exports = visa;