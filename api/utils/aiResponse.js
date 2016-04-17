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
        if (lodash.get(entities, 'intent.0.value', false)) {
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
                else if (!lodash.has(pastContext, 'goalLabel')) {
                    newContext.goalLabel = message;
                }
                // User responded with a price
                else if (lodash.has(entities, 'number')) {
                    newContext.goalCost = lodash.get(entities, 
                                                     'number.0.value');
                }
                // User responded with a goal url
                else if (lodash.has(entities, 'url')) {
                    newContext.goalUrl = entities.url;
                }
                break;
        }
        
        // Merge contexts and store that new merged context!
        mergedContext = lodash.assign({}, pastContext, newContext);
        resolve(mergedContext);
    });
}


function aiResponse(userId, message) {  
    
    return new Promise((resolve, reject) => {
        
        var botMessage, 
            
            pastContext = lodash.get(sessionStorage, userId, {}), 
            witAi = new Wit(process.env.WITAI_SERVER_TOKEN, {
                say: (sessionId, context, message, cb) => {
                    botMessage = message;
                    cb();
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
                resolve();
            }
        });
    });
}

module.exports = exports = aiResponse;
