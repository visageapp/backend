# Visage Backend
> Backend JSON API for Visage

Visage is an intelligent financial assistant that allows you to handle all of your Visa card needs through various outlets, whether it be Facebook Messenger or Slack! With Visage, you can:

* Check account information
* Over-time goals
    * Shopping for an item
    * Vacation Planning
* Block certain types of transactions from happening on your Visa debit/credit card

## API Endpoints
All API endpoints are prefixed with `/api/<versionNumber>`. All consumer-facing API endpoints are given responses in the following form - a **status**, **message** and **data** property is always present:
```javascript
{
    "status": 200,
    "message": "ok",
    "data": <apiRouteSpecific>
}
```

* **POST** `/fbHook`: (Facebook Messenger-facing)
    * Primary Webhook URL for Facebook Messenger - everytime some sort of message is sent by  a user to the Facebook messenger dialog in a conversation with our page, this is hit
    * [Facebook Web Reference](https://developers.facebook.com/docs/messenger-platform/webhook-reference)
    * *Payload*: Check Facebook Web Reference
    * *Response*: Check Facebook Web Reference for structure

* **POST** `/fbLogin`: (Consumer-facing)
    * Route that gets hit whenever a new Facebook user logs into the system
    * *Payload*: JSON:{fbAccessToken, visaPan}
    * *Response*: EMPTY_OBJ
    
## Visa Abstraction Module
An abstraction over Visa's API endpoints can be found at `/api/utils/visa.js`. This module exposes a function that accepts an API endpoint, a request payload and an object with a developer's `userid` and `password` credentials (this third parameter - an object - is optional).

```javascript
// Load environment variables
(require('node-env-file'))(__dirname + "/.env");

var visa = require('./api/utils/visa');
visa('vctc/customerrules/v1/consumertransactioncontrols', 
    {'primaryAccountNumber': '4667596775551010'},
    {userid: "21V9YG3XNSWPKKZCIUNY21ON3uFeCZC0hGuchwo4KxwLjoAFQ", 
    password: "lMkAbcAMAbEFfNhkNO3ZM"})
.then(function (stuff) { console.log(stuff); }, 
    function (error) { console.log(error); });
```

Upon calling the Visa module, you get a `Promise` object giving you the results of the API call to Visa's system. The success callback of the promise returns an object with the following structure:
```javascript
{
    httpResponse: <RequestLibraryDetailsObjectContainingInfoAboutTheRequest>, 
    body: <ObjectOrStringResultOfVisaApiCall>
}
```
The error callback of the promise returns an object with the same structure (if it is an HTTP non-200 response - otherwise, it's a generic error object).

## WitAi Abstraction Module
An abstraction over WitAi can be found at `/api/utils/aiResponse.js`. This module exposes a function that accepts an identifying session id and the user's message. Upon calling the Visa module, you get a `Promise` object giving you the response of the AI.
```javascript
// Load environment variables
(require('node-env-file'))(__dirname + "/.env");

var aiResponse = require('./api/utils/aiResponse');
aiResponse(1, "Create a goal for me!")
.then(function (aiMessage) { console.log(aiMessage); }, 
    function (error) { console.log(error); });
```


## Querying Data from User account

endpoints:
	POST /connect 
	POST /validate 
	GET /balance, 
	GET /income, 
	GET /status

