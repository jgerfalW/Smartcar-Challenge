const express = require('express');
const app = express();


var Smartcar = require("./smartcar.js");


const port = 5050;
app.use(express.json());


app.get('/', function(req, res) {
    res.send('Welcome to the Smartcar API!');
});


app.get('/vehicles/:id', (req,res) => {
    debugger
    try {
        Smartcar.getVehicleInfo(req.params.id, (err, response) =>{
            if(err){
                debugger
                res.status(404).json(err);
            }else{
                debugger
                res.status(200).json(response);
            }
        });
    } catch (error) {
        res.status(500).json({ errMsg: JSON.stringify(error)});
    }

});


app.get('/vehicles/:id/doors', (req,res) => {
    debugger
    try {
        Smartcar.getVehicleDoorStatus(req.params.id, (err, response) =>{
            if(err){
                debugger
                res.status(404).json(err);
            }else{
                debugger
                res.status(200).json(response);
            }
        });
    } catch (error) {
        res.status(500).json({ errMsg: JSON.stringify(error)});
    }

});


app.get('/vehicles/:id/:range(battery|fuel)', (req,res) => {
    debugger
    try {
        let rangeType = req.originalUrl.split('/').pop().toLowerCase();
        Smartcar.getVehicleRange(req.params.id, rangeType, (err, response) =>{
            if(err){
                debugger
                res.status(404).json(err);
            }else{
                debugger
                res.status(200).json(response);
            }
        });
    } catch (error) {
        res.status(500).json({ errMsg: JSON.stringify(error)});
    }

});


app.post('/vehicles/:id/engine', (req,res) => {
    debugger
    if(req.body.action != "START" && req.body.action != "STOP"){
        res.status(404).json({ errMsg: req.body.action + " is not a valid option"});
        return;
    }
    try {
        Smartcar.engineControl(req.params.id, req.body.action, (err, response) =>{
            if(err){
                debugger
                res.status(404).json(err);
            }else{
                debugger
                res.status(200).json(response);
            }
        });
    } catch (error) {
        res.status(500).json({ errMsg: JSON.stringify(error)});
    }

});


// catch non-existant endpoints
app.use(function(req, res) {
    res.status(404).json({
        errMsg: "The requested endpoint does not exist."
    });
});


app.listen(port, () => {
    console.log(`Application is running on: ${port}`);
});