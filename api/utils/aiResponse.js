/**
* Given a Facebook message and user id, we make a Facebook reply
* @param {String} userId - Facebook User Id
* @param {String} message - Facebook message
* @param {Promise} Resolve on success, reject on failure
*/
var Wit = require('node-wit').Wit, 
    lodash = require('lodash'), 

    sessionStorage = {};

function _createContextFromEntities(sessionId, context, 
                                    entities, message) {
    return new Promise((resolve, reject) => {
        var pastContext = context, 
            newContext = {}, 
            mergedContext;
        
        // If this is the start of a user story, clear context!
        if (lodash.get(entities, 'intent.0.value', null)) {
            pastContext = {};
        }
        
        // Based on the intent, parse the context object
        switch (lodash.get(entities, 
                           'intent.0.value', 
                           lodash.get(context, 
                                      'intent', null))) {
                // Story: createGoal
            case "createGoal":
                // Initialized Story
                if (lodash.isEmpty(pastContext)) {
                    newContext.intent = "createGoal";
                }
                // User responded by giving a new goal name
                else if (!lodash.has(pastContext, 'heading')) {
                    newContext.heading = message;
                }
                // User responded with a price
                else if (lodash.has(entities, 'amount_of_money')) {
                    newContext.price = entities.amount_of_money;
                }
                // User responded with a goal url
                else if (lodash.has(entities, 'url')) {
                    newContext.goalLink = entities.url;
                }
                break;
                // Story: accountInformation
            case "accountInformation":
                // Initialized Story
                if (lodash.isEmpty(pastContext)) {
                    newContext.intent = "accountInformation";
                }
                break;
        }

        console.log("Entities :" + JSON.stringify(entities));
        console.log("New Context :" + JSON.stringify(newContext));
        // Merge contexts and store that new merged context!
        mergedContext = lodash.assign({}, pastContext, newContext);
        lodash.set(sessionStorage, sessionId, mergedContext);
        resolve(mergedContext);
    });
}


function aiResponse(userId, message) {  
    var pastContext = lodash.get(sessionStorage, userId, {});

    return new Promise((resolve, reject) => {
        var witAi = new Wit(process.env.WITAI_SERVER_TOKEN, {
            say: (sessionId, context, message, cb) => {
                cb();
                resolve(message);
            },
            merge: (sessionId, context, entities, message, cb) => {
                _createContextFromEntities(sessionId, 
                                           context, 
                                           entities, 
                                           message).then(cb);
            },
            error: (sessionId, context, err) => {
                console.log("Wit Error: " + err.message + 
                            ", For session: " + sessionId);
                reject(err);
            }
        });
        witAi.runActions(userId, 
                         message, 
                         pastContext, 
                         (error, newContext) => {
            if (error) {
                console.log("Wit Error: " + error);
            } else {
                sessionStorage[userId] = newContext;
            }
        });
    });
}

module.exports = exports = aiResponse;

(require('node-env-file'))(__dirname + "/../../.env");
aiResponse(12, "Create a goal for me!").then(function (aiMessage) { 
    console.log(aiMessage);
    return aiResponse(12, "Big blue");
}).then(function (aiMessage) { 
    console.log(aiMessage);
});