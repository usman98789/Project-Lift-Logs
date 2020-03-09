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

var url = "mongodb://localhost:27017/mydb";

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

//create a collection called routines
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("routines", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
}); 

//create a collection called workouts
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("workouts", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
}); 

// create a collection called log
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("log", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
}); 



var isAuthenticated = function(req, res, next) {
    if (!req.username) return res.status(401).end("access denied");
    next();
};

const cookie = require('cookie');

/*
 the follow is our datastructure
 
 Routine:{
     id: something,
     name: something;
 }

 Workout: {
     id: something
     name: something;
     exercises: []  <= a list of exercises
 }
}
not working on date yet, we can leave it for later like when a routine is created
*/

// create an user: this is different from authedication user, this one is for datastorage

// create a routine 
let Routine = (function(){
    return function new_routine(routine_name, user){
        this.routine_name = routine_name;
        this.user = user;
    }
}());

// create a workout
let Workout = (function(){
    return function new_workout(workout_name, routine_id){
        this.workout_name = workout_name;
        this.routine_id = routine_id;
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
            db.close();
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


// Creation


// create routine
app.post('/users/routines/',  isAuthenticated, function (req, res, next) {
    MongoClient.connect(url, function(err, db) {
    if (err) return res.status(500).end(err);
    var dbo = db.db("mydb");
    dbo.collection("routines").insertOne(new Routine(req.body.routine_name, req.session.user), function (err, res) {
        if (err) return res.status(500).end(err);
        db.close();
        return;
    })
    })
});

// create workouts
app.post('/users/workouts/:id/',  isAuthenticated, function (req, res, next) {
    MongoClient.connect(url, function(err, db) {
        if (err) return res.status(500).end(err);
        var dbo = db.db("mydb");
        dbo.collection("workouts").insertOne(new Workout(req.body.workout_name, req.params.id), function (err, res) {
            if (err) return res.status(500).end(err);
            db.close();
            return;
        })
        })
});

// create exercises 
app.post('/users/exercises/:id/',  isAuthenticated, function (req, res, next) {
    MongoClient.connect(url, function(err, db) {
    if (err) return res.status(500).end(err);
    var dbo = db.db("mydb");
    dbo.collection("workouts").updateOne(
        {_id: req.params.id},
        { $push: { exercises: new Exercise(req.body.exercise_name, req.body.sets, req.body.reps, req.body.weights)} }).done(function (err, updElem) {
            if (err) return res.status(500).end(err);
            res.json(updElem);   
            db.close(); 
        });
    })
});

// Read

// get all routines
app.get('/users/routines/', isAuthenticated, function(req, res, next){
    MongoClient.connect(url, function(err, db) {
    if (err) return res.status(500).end(err);
    var dbo = db.db("mydb");
    dbo.collection("routines").find({}, function(err, result) {
        if (err) throw err;
        res.json(result);
        db.close();
      })
    });
});

// get all workouts given a routine
app.get('/users/workouts/:id/', isAuthenticated, function(req, res, next){
    MongoClient.connect(url, function(err, db) {
    if (err) return res.status(500).end(err);
    var dbo = db.db("mydb");
    dbo.collection("workouts").find({routine_id: req.params.id}, function(err, result) {
        if (err) throw err;
        res.json(result);
        db.close();
      })
    });
});

// get a specific workout given workout id
app.get('/users/workouts/:id/:workout_id/', isAuthenticated, function(req, res, next){
    MongoClient.connect(url, function(err, db) {
    if (err) return res.status(500).end(err);
    var dbo = db.db("mydb");
    dbo.collection("workouts").find({routine_id: req.params.id, _id: req.params.workout_id}, function(err, result) {
        if (err) throw err;
        res.json(result);
        db.close();
      })
    });
});

// get users log
app.get('/users/log', isAuthenticated, function(req, res, next){
    MongoClient.connect(url, function(err, db) {
    if (err) return res.status(500).end(err);
    var dbo = db.db("mydb");
    dbo.collection("log").find({user: req.session.user}, null, {sort :{timestamp : -1}}, function(err, result) {
        if (err) throw err;
        res.json(result);
        db.close();
      })
    });
});

// deletion

// delete a routine 
app.delete('/users/routines/:id', isAuthenticated, function(req, res, next){
    MongoClient.connect(url, function(err, db) {
        if (err) return res.status(500).end(err);
        var dbo = db.db("mydb");
        dbo.collection("routines").deleteOne({_id: req.params.id}, function(err, obj) {
            if (err) throw err;
        });
        dbo.collection("workouts").deleteMany({routine_id: req.params.id}, function(err, obj) {
            if (err) throw err;
        });
    });
});

// delete a workout
app.delete('/users/workouts/:id', isAuthenticated, function(req, res, next){
    MongoClient.connect(url, function(err, db) {
        if (err) return res.status(500).end(err);
        var dbo = db.db("mydb");
        dbo.collection("workouts").deleteOne({_id: req.params.id}, function(err, obj) {
            if (err) throw err;
            db.close();
        });
    });
});

// delete an exercise
app.delete('/users/exercise/:id/:exercise_id', isAuthenticated, function(req, res, next){
    MongoClient.connect(url, function(err, db) {
    if (err) return res.status(500).end(err);
    var dbo = db.db("mydb");
    dbo.collection("workouts").update({_id: req.params.id}, {$pull: {exercises: {_id: req.params.exercise_id}}}).done(function (err, updElem) {
        if (err) return res.status(500).end(err);
        res.json(updElem);   
        db.close(); 
        });
    });
});

// write

// all write function requires a new object in return, we can modify it later, but i dont think there is any efficiency improvement

// modify the routine, the only thing we can modify is its name
app.patch('/users/routine/:id/', isAuthenticated, function(req, res, next){
    MongoClient.connect(url, function(err, db) {
    if (err) return res.status(500).end(err);
    var dbo = db.db("mydb");
    dbo.collection("routines").update({_id: req.params.id}, req.body.updated_routine).done(function (err, updElem) {
        if (err) return res.status(500).end(err);
        res.json(updElem);   
        db.close(); 
        });
    });
});



// modify a workout (replace the existing workout) I dont know if we really need to modify an exercise since we can simply bind the whole workout in the req
app.patch('/users/workout/:id/', isAuthenticated, function(req, res, next){
    MongoClient.connect(url, function(err, db) {
    if (err) return res.status(500).end(err);
    var dbo = db.db("mydb");
    dbo.collection("workouts").update({_id: req.params.id}, req.body.updated_workout).done(function (err, updElem) {
        if (err) return res.status(500).end(err);
        res.json(updElem);   
        db.close(); 
        });
    });
});

// add an workout to log along with timestmap
app.patch('/users/log/', isAuthenticated, function(req, res, next){
    MongoClient.connect(url, function(err, db) {
    if (err) return res.status(500).end(err);
    var dbo = db.db("mydb");
    dbo.collection("log").insertOne({workout: req.body.workout, user: req.session.user, timestamp: { type: Date, default: Date.now}}, function (err, res) {
        if (err) return res.status(500).end(err);
        db.close();
        })
    });
});


const http = require('http');
const PORT = 3000;

http.createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});