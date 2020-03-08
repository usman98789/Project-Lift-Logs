const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const crypto = require('crypto');
const session = require('express-session');
const mongo = require('mongodb'); 


app.use(session({
    secret: 'please change this secret',
    resave: false,
    saveUninitialized: true,
}));

var fs = require('fs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('static'));

app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});



// mongodb creation
var MongoClient = mongo.MongoClient;

var url = "mongodb://localhost:30000/mydb";

// create a collection called clients
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("clients", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
}); 

//create a collection called data
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("data", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
}); 

var isAuthenticated = function(req, res, next) {
    if (!req.username) return res.status(401).end("access denied");
    next();
};

var isAuthenticatedRead = function(req, res, next) {
    if (!req.username) return res.status(401);
    next();
};

const cookie = require('cookie');

/*
 the follow is our datastructure
{ username: "rahmthehandsome",
  routine : [{name: "chestallday", workouts: [{name: "upperchest", exercises: [{name: "bench", reps: 100, weight: 10kg}, {"another_bench, reps: 5, weight: 50kg"}]}]}]
}
not working on date yet, we can leave it for later like when a routine is created
*/

// create an user: this is different from authedication user, this one is for datastorage

let User = (function(){
    return function new_user(user_name){
        this.user_name = user_name;
        this.routine = [];
        this.temp_workout = new Workout("Temp Workout");
        this.Completed_workout = [];
    }
}());

// create a routine 
let Routine = (function(){
    return function new_routine(routine_name){
        this.routine_name = routine_name;
        this.workouts = [];
    }
}());

// create a workout
let Workout = (function(){
    return function new_workout(workout_name){
        this.workout_name = workout_name;
        this.exercises = [];
    }
}());

// create an exercise
let Exercise = (function(){
    return function new_exercise(exercise_name, sets, reps,  weights){
        this.exercise_name = exercise_name;
        this.sets = sets;
        this.reps = reps;
        this.weights = weights;
    }
}());




app.use(function (req, res, next){
    var cookies = cookie.parse(req.headers.cookie || '');
    req.username = (cookies.username)? cookies.username : null;
    console.log("HTTP request", req.username, req.method, req.url, req.body);
    next();
});

// User 
app.post('/signup/', function (req, res, next) {
    var username = req.body.username;
    // generate saltedhash for password
    var salt = crypto.randomBytes(16).toString('base64');
    var hash = crypto.createHmac('sha512', salt);
    hash.update(req.body.password);
    var password = hash.digest('base64');
    // check whether username exists
    MongoClient.connect(url, function(err, db) {
        if (err) return res.status(500).end(err);
        var dbo = db.db("mydb");
        dbo.collection("clients").findOne({_id: username}, function(err, result) {
          if (err) return res.status(500).end(err);
          if (result) res.status(409).end("username " + username + " already exists");
          else{
            // insert username, password and salt to the database
            dbo.collection("clients").insertOne({_id: username, password: password, salt: salt}, function (err, res) {
                if (err) return res.status(500).end(err);
                // push user_name to the data_collection
                dbo.collection("data").insertOne(new User(username), function(err, result) {
                    if (err) return res.status(500).end(err);
                });
                res.setHeader('Set-Cookie', cookie.serialize('username', username, {
                    path : '/', 
                    maxAge: 60 * 60 * 24 * 7
                }));
                req.session.user = username;
                db.close();
                return res.json("user " + username + " signed up");
            })
          }
          db.close();
        });
      }); 
});

app.post('/signin/', function (req, res, next) {
    var username = req.body.username;
    // retrieve user from the database
        MongoClient.connect(url, function(err, db) {
            if (err) return res.status(500).end(err);
            var dbo = db.db("mydb");
            dbo.collection("clients").findOne({_id: username}, function(err, result) {
            if (err) return res.status(500).end(err);
            if (!result) return res.status(401).end("access denied");
            var hash = crypto.createHmac('sha512', result.salt);
            hash.update(req.body.password);
            var password = hash.digest('base64');
            if (result.password !== password) return res.status(401).end("Invalid Password, access denied"); 
            // initialize cookie
            res.setHeader('Set-Cookie', cookie.serialize('username', username, {
                path : '/', 
                maxAge: 60 * 60 * 24 * 7
            }));
            req.session.user = username;
            return res.json("user " + username + " signed in");
        });
    });
});

app.get('/signout/', function (req, res, next) {
    res.setHeader('Set-Cookie', cookie.serialize('username', '', {
          path : '/', 
          maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    req.session.destroy();
    res.redirect('/');
});




/** TODO
// Creation

// create routine

// create workouts

// create exercises 

// create temp workout

// Read

// write
 
**/

const http = require('http');
const PORT = 3000;

http.createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});