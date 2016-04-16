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
    
    function promiseExecutor(resolve, reject) {
        fsPromise
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
            .then(({privateContents, certificateContents}) => {
                function promiseExecutor(resolve, reject) {
                    var userId = userDetails.userid,
                        userPass = userDetails.password;
                    
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
                        body: payload
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
    
    return new Promise(promiseExecutor);
}

module.exports = exports = visa;
