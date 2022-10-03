
/**
 * Brief: This is a utility file is primarily being used to assist with validating or parsing of input 
 * passed to it from smartcar.js.
 * 
 * Author: Joe Gerfal.
 * 
 * Date: Oct 2nd, 2022.
 */


/**
 * Brief: checking if inputs for an API request is of the correct form and
 * returns validation or relevant params that are ready to be passed to GM API
 * @param {*} payload 
 * @returns {*} validation object containg {valid: TRUE|FALSE, reason: "reason of failing validation if false"}
 */
exports.validateFields = function(payload){


    let validation = { valid: true, reason: undefined };

    // Check if payload exists.
    if(payload === undefined){
        validation.valid = false;
        validation.reason = "Vehicle parameters cannot be found.";
        return validation;
    }

    // Check for valid ID input.
    if('id' in payload){
        if(payload.id === undefined && payload.id.length === 0){
            validation.reason = "Vehicle ID cannot be found.";
            validation.valid = false;
            return validation;
        } 
        if((typeof payload.id != "string") && !Number.isInteger(payload.id)){
            validation.reason = "Vehicle ID is not valid. " + typeof(payload.id) + " is not a valid option.";
            validation.valid = false;
            return validation;
        }
    } 
    
    // Check for valid command input and parse command actions.
    if('command' in payload){
        if(payload.command === undefined && payload.command.length === 0){
            validation.reason = "Vehicle action of (START|STOP) cannot be found.";
            validation.valid = false;
            return validation;
        } 
        else if(typeof(payload.command) != "string" && typeof(payload.command) != "unicode"){
            validation.reason = "Input for vehicle action of (START|STOP) is not valid. " + typeof(payload.command) + " is not a valid optioin.";
            validation.valid = false;
            return validation;
        }
        else if(payload.command === "START"){
            payload.command = "START_VEHICLE";
        }
        else if(payload.command === "STOP"){
            payload.command = "STOP_VEHICLE"
        }
        else{
            validation.reason = "Vehicle action of is not valid. " + payload.command + " is not a valid optioin.";
            validation.valid = false;
            return validation;
        }
    }

    return validation;
}