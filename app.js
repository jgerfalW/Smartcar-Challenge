const express = require('express');
const app = express();
const Smartcar = require("./smartcar.js");

const port = 5050;
app.use(express.json());


/**
 * Brief: This is the Express instance that runs locally on localhost:5050. We can perform  
 * GET/POST requests on the routes that have been defined below.
 * 
 * Author: Joe Gerfal.
 * 
 * Date: Oct 2nd, 2022.
 */



/**
 * Brief: Route for landing page.
 * @param {*} req 
 * @param {*} res 
 */
app.get('/', function(req, res) {
    res.send('Welcome to the Smartcar API!');
});


/**
 * Brief: Route for sub-route '/vehicles' if no vehicle id was found.
 * @param {*} req 
 * @param {*} res 
 */
app.get('/vehicles', function(req, res) {
    res.send("<h3>Here are the available calls to this API:</h3>\
        <ul>\
        <li>GET /vehicles/:id</li>\
        <li>GET /vehicles/:id/doors</li>\
        <li>GET /vehicles/:id/(battery|fuel)</li>\
        <li>POST /vehicles/:id/engine</li>\
        <ul>");
});


/**
 * Brief: Route for getting vehicle info using vehicle ID.
 * @param {*} req 
 * @param {*} res 
 */
app.get('/vehicles/:id', (req,res) => {
    try {
        Smartcar.getVehicleInfo(req.params.id, (err, response) =>{
            if(err){
                res.status(404).json({ errMsg: err });
            }else{
                res.status(200).json(response);
            }
        });
    } catch (error) {
        res.status(500).json({ errMsg: JSON.stringify(error) });
    }

});


/**
 * Brief: Route for getting status of each door for a vehicle using vehicle ID.
 * @param {*} req 
 * @param {*} res 
 */
app.get('/vehicles/:id/doors', (req,res) => {
    try {
        Smartcar.getVehicleDoorStatus(req.params.id, (err, response) =>{
            if(err){
                res.status(404).json(err);
            }else{
                res.status(200).json(response);
            }
        });
    } catch (error) {
        res.status(500).json({ errMsg: JSON.stringify(error) });
    }

});


/**
 * Brief: Route for getting vehicle range for a fuel or a battery vehicle using vehicle ID.
 * @param {*} req 
 * @param {*} res 
 */
app.get('/vehicles/:id/:range(battery|fuel)', (req,res) => {
    try {
        let rangeType = req.originalUrl.split('/').pop().toLowerCase();
        Smartcar.getVehicleRange(req.params.id, rangeType, (err, response) =>{
            if(err){
                res.status(404).json(err);
            }else{
                res.status(200).json(response);
            }
        });
    } catch (error) {
        res.status(500).json({ errMsg: JSON.stringify(error) });
    }

});


/**
 * Brief: Route for starting/stopping an engine of a vehicle using vehicle ID and action (START|STOP).
 * I used postman to render a post request and passed action in the body as an object.
 * EX: body = {
            "action": "START"
        }
 * @param {*} req 
 * @param {*} res 
 */
app.post('/vehicles/:id/engine', (req,res) => {
    if(req.body.action != "START" && req.body.action != "STOP"){
        res.status(404).json({ errMsg: req.body.action + " is not a valid option. use START or STOP."});
        return;
    }
    try {
        Smartcar.engineControl(req.params.id, req.body.action, (err, response) =>{
            if(err){
                res.status(404).json(err);
            }else{
                res.status(200).json(response);
            }
        });
    } catch (error) {
        res.status(500).json({ errMsg: JSON.stringify(error) });
    }

});


/**
 * Brief: Route for catching non-existant endpoints.
 * @param {*} req 
 * @param {*} res 
 */
app.use(function(req, res) {
    res.status(404).json({
        errMsg: "The requested endpoint does not exist."
    });
});


/**
 * Brief: App will listen in port 5050.
 */
app.listen(port, () => {
    console.log(`Application is running on: ${port}`);
});