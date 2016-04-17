var request = require('request'),
    fsPromise = require('fs-promise'), 
    path = require('path');

/**
* Helper util for calling the Visa API.
* @param {String} apiPath - Path to API visa
* @param {Object|?} payload - Payload to send to Visa API
* @param {String} requestMethod - request method in lower-case string
* @param {Object|Optional} userDetails - {userid, password}
* @returns {Promise} Resolve on success, Rejected otherwise
*/
function visa(apiPath, payload, requestMethod, userDetails) {

    return fsPromise
        .readFile(`${__dirname}/../../keys/visa_private.pem`)
        .then((privateContents) => {
        return fsPromise
            .readFile(`${__dirname}/../../keys/visa_certificate.pem`)
            .then((certificateContents) => {
                return {
                    privateContents,
                    certificateContents
                };
            });
        })
        .then((contents) => {
            function promiseExecutor(resolve, reject) {
                var userId, userPass, requestObj, 
                    privateContents = contents.privateContents,
                    certificateContents = contents.certificateContents;
                
                if (typeof payload === "object") {
                    payload = JSON.stringify(payload);
                }
                
                // No user details? Default to environment variables
                if (!userDetails) {
                    userId = process.env.VISA_USERID;
                    userPass = process.env.VISA_PASSWORD;
                } else {
                    userId = userDetails.userid;
                    userPass = userDetails.password;
                }
                
                if (requestMethod) {
                    requestObj = request[requestMethod];
                } else {
                    requestObj = request.post;
                }
                requestObj({
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
                    var bodyParsed;
                    
                    // Try parsing the response body as an object
                    try {
                        bodyParsed = JSON.parse(body);
                    } catch (e) {
                        bodyParsed = body;
                    }
                    
                    // If Promise error or HTTP error, reject
                    if (err || httpResponse.statusCode !== 200) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        
                        reject({httpResponse, body: bodyParsed});
                        return;
                    }
                    
                    resolve({httpResponse, body: bodyParsed});
                });
            }
            return new Promise(promiseExecutor);
        });
}

module.exports = exports = visa;
