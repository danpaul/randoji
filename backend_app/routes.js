const ERROR_GENERIC = {error: 'An error occurred', errorSymbol: 'unkownError'};
const ERROR_INVALID_INPUT = {error: 'Missing required params', errorSymbol: 'missingParams'};
const ERROR_NO_USER = {error: 'Could not find user', errorSymbol: 'noUser'};

// asdf
// const EXPIRATION_USER = 30;
const EXPIRATION_USER = 3000;
const EXPIRATION_QUESTION = 30;

var uuid = require('node-uuid');
var config = require('../config');
var mongoose = require('mongoose');
var fs = require('fs');

var f = __dirname + '/../questions.json';
var questions = JSON.parse(fs.readFileSync(f, 'utf8'));

mongoose.connect(config.mongoUrl, function(err){
    if( err ){ throw(err) }
});
var Schema = mongoose.Schema
var UserSchema = new Schema({
    location: {
        type: [Number], // [<longitude>, <latitude>]
        index: '2d' // create the geospatial index
    },
    paused: {type: Boolean, default: false},
    lastUpdated: {type: Date, index: { expireAfterSeconds: EXPIRATION_USER }},
    question: {type: Object, default: {}},
    questionData: {type: Object, default: {}}
});
var User = mongoose.model('user', UserSchema);

var QuestionSchema = new Schema({
    created: {type: Date, index: { expireAfterSeconds: EXPIRATION_QUESTION }},
    question: {type: Object}
});
var Question = mongoose.model('user', UserSchema);

/*******************************************************************************

                    ROUTES

*******************************************************************************/

module.exports = function(app){

    app.get('/', function(req, res){ res.sendFile('../public/index.html'); });

    app.get('/api/create', function(req, res){
        var location = [Number(req.body.long), Number(req.body.lat)];
        if( Number.isNaN(location[0]) || Number.isNaN(location[1]) ){
            return res.json(ERROR_INVALID_INPUT);
        }
        var location = [0.0, 0.0];
        var user = new User({location: location, lastUpdated: Date.now()});
        user.save(function(err, resp){
            if( err ){
                console.log(err);
                return res.json(ERROR_GENERIC);
            }
            return res.json(resp.toObject());
        });
    });

    app.post('/api/update', function(req, res){
        var location = [Number(req.body.long), Number(req.body.lat)];
        var userId = req.body.userId;
        if( Number.isNaN(location[0]) || Number.isNaN(location[1]) || !userId ){
            return res.json(ERROR_INVALID_INPUT);
        }
        User.findById(userId, function(err, user){
            if( err ){
                console.log(err);
                return res.json(ERROR_GENERIC);
            }
            if( !user ){
                console.log(err);
                return res.json(ERROR_NO_USER);
            }
            user.location = location;
            user.lastUpdated = Date.now();
            user.save(function(err, resp){
                if( err ){
                    console.log(err);
                    return res.json(ERROR_GENERIC);
                }
                return res.json(resp.toObject());
            })
        })
    });

    app.post('/api/hasquestion', function(req, res){
        var userId = req.body.userId;
        if( !userId ){ return res.json(ERROR_INVALID_INPUT); }
        User.findById(userId, function(err, user){
            if( err ){
                console.log(err);
                return res.json(ERROR_NO_USER);
            }
        });
    });

    app.get('/healthcheck', function(req, res){
        console.log(req.session);
        res.send('ok')
    })

    app.get('/positions-all', function(req, res){
        var responseObject = getReponseObject()
        point.findAll(function(err, points){
            if( err ){
                console.log(err)
                responseObject.status = 'error'
            } else {
                responseObject.data = points
            }
            res.json(responseObject)
        })
    })

    // example call: /positions-near?longitude=-73.9475406&latitude=40.6762954&range=5.0
    // range is in KM
    // TODO: validation
    app.get('/positions-near', function(req, res){

        var responseObject = getReponseObject()
        point.findNear(req.query.longitude,
                       req.query.latitude,
                       req.query.range,
                       function(err, points){

            if( err ){
                console.log(err)
                responseObject.status = 'error'
            } else {
                responseObject.data = points
            }
            res.json(responseObject)

        })    
    })

    /**
    *    locationData should look like this
    *    {
    *        title: 'some title',
    *        user: 12233,
    *        location: [2.17403, 41.40338] // longitude, latitude
    *    }
    */
    app.post('/position', function (req, res) {
        var responseObject = getReponseObject()
        var pointData = req.body
        //TODO: validation

        point.add(pointData, function(err, point){
            if( err ){
                console.log(err)
                responseObject.status = 'error'
            } else {
                responseObject.data = point;
            }
            res.json(responseObject)
        })        
    })
}