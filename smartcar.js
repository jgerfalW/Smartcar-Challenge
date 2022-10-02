const { default: axios } = require("axios");
const util = require('./util.js')


exports.getVehicleInfo =  async function(id, callback){
    debugger

    const headers = {
        'Content-Type': 'application/json'
    };
    const payload = {
        "id": id,
        "responseType": "JSON"
    }

    let validate = util.validateFields(payload);
    if(validate.valid === false){
        callback(validate.reason, undefined);
    }
    debugger

    const rsp = await axios.post('http://gmapi.azurewebsites.net/getVehicleInfoService', payload, headers);

    debugger

    let returnData = {};
    let data = {};
    let vin, color, driveTrain = "";

    if(rsp.statusText === 'OK'){

        if('data' in rsp.data){
            data = rsp.data.data;
        } else {
            callback("Something went wrong. Vehicle data is not found", undefined);
        }

        if('vin' in data){
            vin = data.vin.value;
        } else {
            callback("Something went wrong. Vehicle vin is not found", undefined);
        }

        if('color' in data){
            color = data.color.value;
        } else {
            callback("Something went wrong. Vehicle color is not found", undefined);
        }

        let doorCount = 0;
        if('fourDoorSedan' in data && 'twoDoorCoupe' in data){
            if(data.fourDoorSedan.value === 'True'){
                doorCount = 4;
            }
            if(data.twoDoorCoupe.value === 'True'){
                doorCount = 2;
            }
        } else {
            callback("Something went wrong. Vehicle door count is not found", undefined);
        }

        if('driveTrain' in data){
            driveTrain = data.driveTrain.value;
        } else {
            callback("Something went wrong. Vehicle drive train is not found", undefined);
        }

        if(vin != undefined && vin.length > 0 &&
            color != undefined && color.length > 0 &&
            doorCount != undefined && doorCount > 0 &&
            driveTrain != undefined && driveTrain.length > 0){
                returnData = {
                    vin: vin,
                    color: color,
                    doorCount: doorCount,
                    driveTrain: driveTrain
                }
                callback(undefined, returnData);

            } else {
                callback("Something went wrong. Vehicle info is not found", undefined);
            }

    } else {
        callback(rsp.error, undefined);
    }
}


exports.getVehicleDoorStatus = async function(id, callback){


    const headers = {
        'Content-Type': 'application/json'
    };
    const payload = {
        "id": id,
        "responseType": "JSON"
    }

    let validate = util.validateFields(payload);
    if(validate.valid === false){
        callback(validate.reason, undefined);
    }
    debugger

    const rsp = await axios.post('http://gmapi.azurewebsites.net/getSecurityStatusService', payload, headers);

    debugger

    let returnData = [];
    let data = {};
    let values = [];
    let locked;

    if(rsp.statusText === 'OK'){

        if('data' in rsp.data){
            data = rsp.data.data;
        } else {
            callback("Something went wrong. Vehicle data is not found", undefined);
        }

        if('doors' in data){
            if('values' in data.doors){
                values = data.doors.values; 
                for(let i=0; i<values.length; i++){
                    if(values[i].locked.value === 'True'){
                        locked = true;
                    }
                    if(values[i].locked.value === 'False'){
                        locked = false;
                    }
                    let returnValue = {
                        location: values[i].location.value,
                        locked: locked
                    }
                    returnData.push(returnValue);
                }
            }
            callback(undefined, returnData);
        } else {
            callback("Something went wrong. Vehicle doors info is not found", undefined);
        }

    } else {
        callback(rsp.error, undefined);
    }
}


exports.getVehicleRange = async function(id, rangeType, callback){


    const headers = {
        'Content-Type': 'application/json'
    };
    const payload = {
        "id": id,
        "responseType": "JSON"
    }

    let validate = util.validateFields(payload);
    if(validate.valid === false){
        callback(validate.reason, undefined);
    }
    debugger

    const rsp = await axios.post('http://gmapi.azurewebsites.net/getEnergyService', payload, headers);

    debugger

    let returnData = {};

    if(rsp.statusText === 'OK'){

        if('data' in rsp.data){
            data = rsp.data.data;
        } else {
            callback("Something went wrong. Vehicle data is not found", undefined);
        }

        if(rangeType === 'fuel'){
            if(data.tankLevel.value != 'null'){
                returnData.percent = parseFloat(data.tankLevel.value);
                callback(undefined, returnData);
            } else {
                callback(`Vehicle range info does not support ${rangeType}`, undefined);
            }
        }
        else if(rangeType === 'battery'){
            if(data.batteryLevel.value != 'null'){
                returnData.percent = parseFloat(data.batteryLevel.value);
                callback(undefined, returnData);
            } else {
                callback(`Vehicle range info does not support ${rangeType}`, undefined);
            }
        }
        else {
            callback("Something went wrong. Vehicle range info is not found", undefined);
        }

    } else {
        callback(rsp.error, undefined);
    }
}


exports.engineControl = async function(id, action, callback){


    const headers = {
        'Content-Type': 'application/json'
    };
    const payload = {
        "id": id,
        "command": action,
        "responseType": "JSON"
    }

    let validate = util.validateFields(payload);
    if(validate.valid === false){
        callback(validate.reason, undefined);
    }
    debugger

    const rsp = await axios.post('http://gmapi.azurewebsites.net/actionEngineService', payload, headers);

    debugger

    let returnData = {};

    if(rsp.statusText === 'OK'){

        if('data' in rsp){
            data = rsp.data;
        } else {
            callback("Something went wrong. Vehicle data is not found", undefined);
        }

        if('actionResult' in data){
            if(data.actionResult.status === 'EXECUTED'){
                returnData.status = 'success';
            }
            if(data.actionResult.status === 'FAILED'){
                returnData.status = 'error';
            }
            callback(undefined, returnData);
        } else {
            callback("Something went wrong. Vehicle action result is not found", undefined);
        }

    } else {
        callback(rsp.error, undefined);
    }
}