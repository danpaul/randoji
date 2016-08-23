var config = {};

if( window.location.href.toLowerCase().indexOf('localhost') !==  -1 ||
    window.location.href.toLowerCase().indexOf('0.0.0.0') !==  -1 ){
    config.environment = 'development';
} else {
    config.environment = 'production';
}

if( config.environment === 'development' ){

    config.geoLitEndpoint = 'http://localhost:3000';
    config.testing = true;

} else {

    config.testing = false;
}

config.commentEndpoint = config.geoLitEndpoint + '/discussion';
config.userEndpoint = config.geoLitEndpoint + '/user';

module.exports = config;