const { default: axios } = require("axios");
const util = require('./util.js');

/**
 * Brief: This contains the functions that parse input from client requests, obtain relevant
 * data from the GM API and return the required data in a clean format to the client.
 * 
 * Author: Joe Gerfal.
 * 
 * Date: Oct 2nd, 2022.
 */



/**
 * Brief: Get vehicle information using Vehicle ID.
 * @param {*} id 
 * @param {*} callback 
 * @returns JSON object containing requested vehicle information (vin, color, doorCount, driveTrain) if found.
 */
exports.getVehicleInfo =  async function(id, callback){

    const headers = {
        'Content-Type': 'application/json'
    };
    const payload = {
        "id": id,
        "responseType": "JSON"
    }

    // Check for valid input in payload
    if('id' in payload){
        let validate = util.validateFields(payload);
        if(validate.valid === false){
            callback(validate.reason, undefined);
            return;
        }
    } else {
        callback("Internal Server Error: Vehicle id is not found.", undefined);
        return;
    }

    // Perform POST request to GM API to obtain relevant data.
    const rsp = await axios.post('http://gmapi.azurewebsites.net/getVehicleInfoService', payload, headers);

    let returnData = {};
    let data = {};
    let vin, color, driveTrain = "";

    // Proceed with constructing the return object only if we have recieved data correctly.
    if(rsp.statusText === 'OK'){

        // Validate that a car with specified id exists.
        if('data' in rsp.data){
            data = rsp.data.data;
        } else {
            callback("Internal Server Error: Vehicle data is not found", undefined);
            return;
        }

        // Get relevant data if present (vin, color, doorCount, droiveTrain).
        if('vin' in data){
            vin = data.vin.value;
        } else {
            callback("Internal Server Error: Vehicle vin is not found", undefined);
            return;
        }

        if('color' in data){
            color = data.color.value;
        } else {
            callback("Internal Server Error: Vehicle color is not found", undefined);
            return;
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
            callback("Internal Server Error: Vehicle door count is not found", undefined);
            return;
        }

        if('driveTrain' in data){
            driveTrain = data.driveTrain.value;
        } else {
            callback("Internal Server Error: Vehicle drive train is not found", undefined);
            return;
        }

        // Return the data we grabbed in a JSON if (vin, color, doorCount, driveTrain) are present.
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
                return;

            } else {
                callback("Internal Server Error: Vehicle info is not found", undefined);
                return;
            }

    } else {

        // Handle error if response status is not OK.
        callback(rsp.data.reason, undefined);
        return;
    }
}


/**
 * Brief: Get all vehicle doors status using Vehicle ID (LOCKED: TRUE|FALSE).
 * @param {*} id 
 * @param {*} callback 
 * @returns Array of object containing all requested vehicle doors status if found.
 */
exports.getVehicleDoorStatus = async function(id, callback){


    const headers = {
        'Content-Type': 'application/json'
    };
    const payload = {
        "id": id,
        "responseType": "JSON"
    }

    // Check for valid input in payload
    if('id' in payload){
        let validate = util.validateFields(payload);
        if(validate.valid === false){
            callback(validate.reason, undefined);
            return;
        }
    } else {
        callback("Internal Server Error: Vehicle id is not found.", undefined);
        return;
    }

    // Perform POST request to GM API to obtain relevant data.
    const rsp = await axios.post('http://gmapi.azurewebsites.net/getSecurityStatusService', payload, headers);

    let returnData = [];
    let data = {};
    let values = [];
    let locked;

    // Proceed with constructing the return object only if we have recieved data correctly.
    if(rsp.statusText === 'OK'){

        // Validate that a car with specified data exists.
        if('data' in rsp.data){
            data = rsp.data.data;
        } else {
            callback("Internal Server Error: Vehicle data is not found", undefined);
            return;
        }

        // Get relevant data for each door if present (LOCKED: TRUE|FALSE).
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

            // Return the data we grabbed in as an array of objects.
            callback(undefined, returnData);
            return;
        } else {
            callback("Internal Server Error: Vehicle doors info is not found", undefined);
            return;
        }

    } else {

        // Handle error if response status is not OK.
        callback(rsp.data.reason, undefined);
        return;
    }
}


/**
 * Brief: Get vehicle range using Vehicle ID (FUEL|BATTERY).
 * @param {*} id 
 * @param {*} callback 
 * @returns JSON object containing requested vehicle range if found.
 */
exports.getVehicleRange = async function(id, rangeType, callback){


    const headers = {
        'Content-Type': 'application/json'
    };
    const payload = {
        "id": id,
        "responseType": "JSON"
    }

    // Check for valid input in payload
    if('id' in payload){
        let validate = util.validateFields(payload);
        if(validate.valid === false){
            callback(validate.reason, undefined);
            return;
        }
    } else {
        callback("Internal Server Error: Vehicle id is not found.", undefined);
        return;
    }

    // Perform POST request to GM API to obtain relevant data.
    const rsp = await axios.post('http://gmapi.azurewebsites.net/getEnergyService', payload, headers);

    let returnData = {};

     // Proceed with constructing the return object only if we have recieved data correctly.
    if(rsp.statusText === 'OK'){

        // Validate that a car with specified data exists.
        if('data' in rsp.data){
            data = rsp.data.data;
        } else {
            callback("Internal Server Error: Vehicle data is not found", undefined);
            return;
        }

        // Get relevant data if present (RANGE: BATTERY|FUEL) and return it.
        if(rangeType === 'fuel'){
            if(data.tankLevel.value != 'null'){
                returnData.percent = parseFloat(data.tankLevel.value);
                callback(undefined, returnData);
                return;
            } else {
                callback(`Vehicle range info does not support ${rangeType}`, undefined);
                return;
            }
        }
        else if(rangeType === 'battery'){
            if(data.batteryLevel.value != 'null'){
                returnData.percent = parseFloat(data.batteryLevel.value);
                callback(undefined, returnData);
                return;
            } else {
                callback(`Vehicle range info does not support ${rangeType}`, undefined);
                return;
            }
        }
        else {
            callback("Internal Server Error: Vehicle range info is not found", undefined);
            return;
        }

    } else {

        // Handle error if response status is not OK.
        callback(rsp.data.reason, undefined);
        return;
    }
}


/**
 * Brief: Post vehicle engine action using Vehicle ID (START|STOP).
 * @param {*} id 
 * @param {*} callback 
 * @returns JSON object containing requested vehicle action if found (success|error).
 */
exports.engineControl = async function(id, action, callback){


    const headers = {
        'Content-Type': 'application/json'
    };
    const payload = {
        "id": id,
        "command": action,
        "responseType": "JSON"
    }

    // Check for valid input in payload
    if('id' in payload && 'command' in payload){
        let validate = util.validateFields(payload);
        if(validate.valid === false){
            callback(validate.reason, undefined);
            return;
        }
    } else {
        callback("Internal Server Error: Vehicle id and action are not found.", undefined);
        return;
    }

    // Perform POST request to GM API to obtain relevant data.
    const rsp = await axios.post('http://gmapi.azurewebsites.net/actionEngineService', payload, headers);

    let returnData = {};

    // Proceed with constructing the return object only if we have recieved data correctly.
    if(rsp.statusText === 'OK'){

        // Validate that a car with specified data exists.
        if('data' in rsp){
            data = rsp.data;
        } else {
            callback("Internal Server Error: Vehicle data is not found", undefined);
            return;
        }

        // Get relevant data if present (result of action: success|error) and return it.
        if('actionResult' in data){
            if(data.actionResult.status === 'EXECUTED'){
                returnData.status = 'success';
            }
            if(data.actionResult.status === 'FAILED'){
                returnData.status = 'error';
            }
            callback(undefined, returnData);
            return;
        } else {
            callback("Internal Server Error: Vehicle action result is not found", undefined);
            return;
        }

    } else {

        // Handle error if response status is not OK.
        callback(rsp.data.reason, undefined);
        return;
    }
}