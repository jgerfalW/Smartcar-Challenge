# Smartcar-Challenge
Smartcar Backend Coding Challenge

Usage

To emulate the Smartcar API, I developed a local Express/Node instance with the routes specified in the API spec that runs on localhost. To run this server run 'nodemon app.js' and navigate to localhost:5050/<route> using your web browser where <route> is one of the routes specified in the Smartcar API spec. Make sure you are in the 'Smartcar-Challenge' directory in order to see the nodemon run successfully.

GET requests:
E.g. http://localhost:5050/vehicles/1235 or http://localhost:5050/vehicles/1235/battery

POST requests:
Use postman to post engine actions with body as JSON object containing the action.
E.g. http://localhost:5050/vehicles/1235/engine
    body = {
        "action": "START"
    }


Testing

Testing GET/POST requests to the routes built to ensure validity of input and output using tape and supertest libraries.
This involved testing the routing logic built in app.js to ensure that the routes have been developed properly and that the API is taking in the right inputs and providing the right outputs in the intended formats. This was done to ensure that client requests to the Smartcar API exhibit the intended behaviour and have the right responses if they are valid. Testing functions are located in 'testing.js'. To run this test file run 'nodemon testing.js'.

Note: vehicle doors' unclocked status test might fail because the api does not always return true or false for a specified door for the requested vehicle.