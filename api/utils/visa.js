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

var playload = {
    "globalControl": {
        "alertThreshold": 150, //value
        "declineThreshold": 150, //value
        "isControlEnabled": true,
        "shouldAlertOnDecline": true,
        "shouldDeclineAll": true,
        "shouldTargetSpecificCard": true,
        "userIdentifier": "string"
      },
      "transactionControls": [
        {
          "alertThreshold": 150, //value
          "controlType": "TCT_AUTO_PAY",
          "declineThreshold": 150, //value
          "isControlEnabled": true,
          "shouldAlertOnDecline": true,
          "shouldDeclineAll": true,
          "shouldTargetSpecificCard": true,
          "userIdentifier": "string"
        }
      ]
};

module.exports = exports = {
    connect(){
        return visa('vctc/customerrules/v1/consumertransactioncontrols',
            {'primaryAccountNumber': '4667596775551010'},
            {userid: "21V9YG3XNSWPKKZCIUNY21ON3uFeCZC0hGuchwo4KxwLjoAFQ",
            password: "lMkAbcAMAbEFfNhkNO3ZM"});
    },
    get(card){
        return visa('paai/generalattinq/v1/cardattributes/generalinquiry',
            {'primaryAccountNumber': '4667596775551010'},
            {userid: "21V9YG3XNSWPKKZCIUNY21ON3uFeCZC0hGuchwo4KxwLjoAFQ",
            password: "lMkAbcAMAbEFfNhkNO3ZM"});
    },
    secure(){
        return visa(`vctc/customerrules/v1/consumertransactioncontrols/${card}/rules`,
            payload,
            {userid: "21V9YG3XNSWPKKZCIUNY21ON3uFeCZC0hGuchwo4KxwLjoAFQ",
            password: "lMkAbcAMAbEFfNhkNO3ZM"})
    },
    restrict(value){
        payload.globalControl.alertThreshold = value;
        payload.globalControl.declineThreshold = value;
        payload.transactionControls.alertThreshold = value;
        payload.transactionControls.declineThreshold = value;

        // modify payload
        // payload

        return visa(`vctc/customerrules/v1/consumertransactioncontrols/${card}/rules`,
            payload,
            'put',
            {userid: "21V9YG3XNSWPKKZCIUNY21ON3uFeCZC0hGuchwo4KxwLjoAFQ",
            password: "lMkAbcAMAbEFfNhkNO3ZM"})
    }
};
