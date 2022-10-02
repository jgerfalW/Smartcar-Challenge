

exports.validateFields = function(payload){

    debugger
    let validation = { valid: true, reason: undefined };

    if(payload === undefined){
        validation.valid = false;
        validation.reason = "Vehicle parameters cannot be found.";
        return validation;
    }

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