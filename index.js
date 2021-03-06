var config = require('./config')

/*******************************************************************************

                    CONFIGURE APP

*******************************************************************************/

var express = require('express');
var app = module.exports.app = exports.app = express();
var bodyParser = require('body-parser')
var session = require('express-session')

if( config.environment === 'development' ){
    app.use(require('connect-livereload')());
}

app.use(express.static(__dirname + '/public'));

/** 
*   Session handling/body parseing
*/
// app.use(require('cookie-parser')(config.cookieSecret)); 
// app.use(session({
//     secret: config.sessionSecret,
//     resave: true,
//     saveUninitialized: true
// }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/*******************************************************************************

                    PULL IN ROUTES AND START SERVER

*******************************************************************************/

require('./backend_app/routes')(app);

var server = app.listen(config.port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});