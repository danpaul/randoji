var services = {}
var config = require('../../config.js')

var SERVER_ERROR = 'A server error occurred.';

services.add = function(positionData, callbackIn){
    $.ajax({
        type: "POST",
        url: config.geoLitEndpoint + '/position',
        data: positionData,
        success: function(response){
            if( response.status === 'success' ){
                callbackIn(null, response.data);
            } else {
                callbackIn(data.errorMessage);
            }
        },
        error: function(err){
            console.log(err);
            callbackIn(SERVER_ERROR);
        },
        dataType: 'JSON'
    });
}

services.findNear = function(positionData, callbackIn){

    $.ajax({
        type: "GET",
        url: config.geoLitEndpoint + '/positions-near',
        data: positionData,
        success: function(data){
            if( data.status !== 'success' ){
                callbackIn(data.errorMessage);
            } else { callbackIn(null, data.data); }
        },
        error: function(err){
            console.log(err);
            callbackIn(SERVER_ERROR);
        },
        dataType: 'JSON'
    });
}

module.exports = services;