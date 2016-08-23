var STATUS_SUCCESS = 'success',
    STATUS_FAILURE = 'failure',
    STATUS_ERROR = 'error';

module.exports = {
    getUser: function(endpoint, callback){
        makeRequest({
            method: 'GET',
            url: endpoint
        }, function(err, user){
            if( err ){ callback(err); }
            else{
                if( !user || !user.id ){
                    callback(null, null);
                } else {
                    callback(null, user);
                }
            }
        });
    },
    register: function(endpoint, email, username, password, callback){
        makeRequest({
            method: 'POST',
            url: endpoint + '/register',
            data: {
                email: email,
                username: username,
                password: password
            }            
        }, callback);
    },
    login: function(endpoint, email, password, callback){
        makeRequest({
            method: 'POST',
            url: endpoint + '/login',
            data: {
                'email': email,
                'password': password
            }
        }, callback);
    },
    logout: function(endpoint, callback){
        makeRequest({
            method: 'POST',
            url: endpoint + '/logout',
        }, callback);
    }
}

var makeRequest = function(requestData, callback){
    requestData.success = function(response){
        if( response.status === STATUS_SUCCESS ){
            callback(null, response.data);
        } else if(response.status === STATUS_FAILURE || 
                  response.status === STATUS_ERROR ){
            callback(response.message);
        } else {
            callback('An error occurred.');
        }
    }

    requestData.error = function(jqXHR, status, errorThrown){
        callback('Error contacting server.');
    }

    $.ajax(requestData);
}