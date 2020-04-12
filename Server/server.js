require('newrelic');
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const crypto = require('crypto');
const session = require('express-session');
const mongo = require('mongodb');
const tf = require('@tensorflow/tfjs');


app.use(session({
    secret: 'please change this secret',
    resave: false,
    saveUninitialized: true,
}));

var fs = require('fs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('static'));

app.use(function (req, res, next) {
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});


// mongodb creation
var MongoClient = mongo.MongoClient;
let ObjectID = require('mongodb').ObjectID;
var url = "mongodb+srv://longjika:qwer3369@cluster0-8pnth.mongodb.net/test?retryWrites=true&w=majority";

// create a collection called clients
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("clients", function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    });
});

//create a collection called routines
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("routines", function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    });
});

//create a collection called workouts
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("workouts", function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    });
});

// create a collection called log
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("log", function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    });
});



var isAuthenticated = function (req, res, next) {
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

 Exercises: {
     id: something
     name: something
     sets: soemthing
     reps: something
     weights: something
 }
}
not working on date yet, we can leave it for later like when a routine is created
*/

// create an user: this is different from authedication user, this one is for datastorage

// create a routine 
let Routine = (function () {
    return function new_routine(routine_name, user) {
        this.routine_name = routine_name;
        this.user = user;
    }
}());

// create a workout
let Workout = (function () {
    return function new_workout(workout_name, routine_id) {
        this.workout_name = workout_name;
        this.routine_id = routine_id;
        this.exercises = [];
    }
}());

// create an exercise
let Exercise = (function () {
    return function new_exercise(id, exercise_name, sets, reps, weights) {
        this._id = id;
        this.exercise_name = exercise_name;
        this.sets = sets;
        this.reps = reps;
        this.weights = weights;
    }
}());


app.use(function (req, res, next) {
    var cookies = cookie.parse(req.headers.cookie || '');
    req.username = (cookies.username) ? cookies.username : null;
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
    MongoClient.connect(url, function (err, db) {
        if (err) return res.status(500).end(err);
        var dbo = db.db("mydb");
        dbo.collection("clients").findOne({ _id: username }, function (err, result) {
            if (err) return res.status(500).end(err);
            if (result) res.status(409).end("username " + username + " already exists");
            else {
                // insert username, password and salt to the database
                dbo.collection("clients").insertOne({ _id: username, password: password, salt: salt }, function (err, result) {
                    if (err) return res.status(500).end(err);
                    res.setHeader('Set-Cookie', cookie.serialize('username', username, {
                        path: '/',
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
    MongoClient.connect(url, function (err, db) {
        if (err) return res.status(500).end(err);
        var dbo = db.db("mydb");
        dbo.collection("clients").findOne({ _id: username }, function (err, result) {
            if (err) return res.status(500).end(err);
            if (!result) return res.status(401).end("access denied");
            var hash = crypto.createHmac('sha512', result.salt);
            hash.update(req.body.password);
            var password = hash.digest('base64');
            if (result.password !== password) return res.status(401).end("Invalid Password, access denied");
            // initialize cookie
            res.setHeader('Set-Cookie', cookie.serialize('username', username, {
                path: '/',
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
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    req.session.destroy();
    res.redirect('/');
});


// Creation


// create routine
app.post('/users/routines/', isAuthenticated, function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        if (err) return res.status(500).end(err);
        var dbo = db.db("mydb");
        dbo.collection("routines").insertOne(new Routine(req.body.routine_name, req.session.user), function (err, result) {
            if (err) return res.status(500).end(err);
            db.close();
            return res.json(result);
        })
    })
});

// create workouts
app.post('/users/routines/:id/workouts/', isAuthenticated, function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        if (err) return res.status(500).end(err);
        var dbo = db.db("mydb");
        dbo.collection("workouts").insertOne(new Workout(req.body.workout_name, req.params.id), function (err, result) {
            if (err) return res.status(500).end(err);
            db.close();
            return res.json(result);
        })
    })
});

// create exercises 
app.post('/users/routines/workouts/:id/exercises/', isAuthenticated, function (req, res, next) {
    if (req.params.id.length != 24) return res.json("invalid workout id");
    MongoClient.connect(url, function (err, db) {
        if (err) return res.status(500).end(err);
        var dbo = db.db("mydb");
        dbo.collection("workouts").updateOne(
            { _id: ObjectID(req.params.id) },
            { $push: { exercises: new Exercise(ObjectID().toString(), req.body.exercise_name, req.body.sets, req.body.reps, req.body.weights) } }, function (err, updElem) {
                if (err) return res.status(500).end(err);
                db.close();
                return res.json("new exercise pushed\n");
            });
    })
});

// Read

// get all routines
app.get('/users/routines/', isAuthenticated, function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        if (err) return res.status(500).end(err);
        var dbo = db.db("mydb");
        dbo.collection("routines").find({ user: req.session.user }).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
            db.close();
        })
    });
});

// get all workouts given a routine
app.get('/users/routines/:id/workouts/', isAuthenticated, function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        if (err) return res.status(500).end(err);
        var dbo = db.db("mydb");
        dbo.collection("workouts").find({ routine_id: req.params.id }).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        })
    });
});

// get a specific workout given workout id
app.get('/users/routines/:id/workouts/:workout_id/', isAuthenticated, function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        if (err) return res.status(500).end(err);
        var dbo = db.db("mydb");
        dbo.collection("workouts").find({ routine_id: req.params.id, _id: ObjectID(req.params.workout_id) }).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        })
    });
});

// get users log
app.get('/users/log/', isAuthenticated, function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        if (err) return res.status(500).end(err);
        var dbo = db.db("mydb");
        dbo.collection("log").find({ user: req.session.user }, null).sort({ timestamp: -1 }).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        })
    });
});

// deletion

// delete a routine 
app.delete('/users/routines/:id/', isAuthenticated, function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        if (err) return res.status(500).end(err);
        var dbo = db.db("mydb");
        dbo.collection("routines").deleteOne({ _id: ObjectID(req.params.id) }, function (err, obj) {
            if (err) throw err;
        });
        dbo.collection("workouts").deleteMany({ routine_id: req.params.id }, function (err, obj) {
            if (err) throw err;
        });
        res.json("item deleted\n");
    });
});

// delete a workout
app.delete('/users/routines/workouts/:id/', isAuthenticated, function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        if (err) return res.status(500).end(err);
        var dbo = db.db("mydb");
        dbo.collection("workouts").deleteOne({ _id: ObjectID(req.params.id) }, function (err, obj) {
            if (err) throw err;
            db.close();
            res.json(obj);
        });
    });
});

// delete an exercise
app.delete('/users/routines/workouts/:id/exercises/:exercise_id/', isAuthenticated, function (req, res, next) {
    if (req.params.id.length != 24) return res.json("invalid workout id");
    if (req.params.exercise_id.length != 24) return res.json("invalid exercise id");
    MongoClient.connect(url, function (err, db) {
        if (err) return res.status(500).end(err);
        var dbo = db.db("mydb");
        dbo.collection("workouts").updateOne({ _id: ObjectID(req.params.id) }, { $pull: { exercises: { _id: req.params.exercise_id } } }, function (err, updElem) {
            if (err) return res.status(500).end(err);
            res.json(updElem);
            db.close();
        });
    });
});


// delete a workout in the log 
app.delete('/users/log/:id/', isAuthenticated, function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        if (err) return res.status(500).end(err);
        var dbo = db.db("mydb");
        dbo.collection("log").deleteOne({ _id: ObjectID(req.params.id) }, function (err, obj) {
            if (err) throw err;
        });
        res.json("item deleted\n");
    });
});

// write

// all write function requires a new object in return, we can modify it later, but i dont think there is any efficiency improvement

// modify the routine, the only thing we can modify is its name
app.patch('/users/routines/:id/', isAuthenticated, function (req, res, next) {
    if (req.params.id.length != 24) return res.json("invalid routine id");
    MongoClient.connect(url, function (err, db) {
        if (err) return res.status(500).end(err);
        var dbo = db.db("mydb");
        dbo.collection("routines").updateOne({ _id: ObjectID(req.params.id) }, { $set: { routine_name: req.body.routine_name } }, function (err, updElem) {
            if (err) return res.status(500).end(err);
            res.json(updElem);
            db.close();
        });
    });
});



// modify a workout (replace the existing workout) I dont know if we really need to modify an exercise since we can simply bind the whole workout in the req
app.patch('/users/routines/workouts/:id/', isAuthenticated, function (req, res, next) {
    if (req.params.id.length != 24) return res.json("invalid workout id");
    console.log(req.body.exercises);
    MongoClient.connect(url, function (err, db) {
        if (err) return res.status(500).end(err);
        var dbo = db.db("mydb");
        dbo.collection("workouts").updateOne({ _id: ObjectID(req.params.id) }, { $set: { workout_name: req.body.workout_name, exercises: req.body.exercises } }, function (err, updElem) {
            if (err) return res.status(500).end(err);
            res.json(updElem);
            db.close();
        });
    });
});

// add an workout to log along with timestmap
app.patch('/users/log/', isAuthenticated, function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        if (err) return res.status(500).end(err);
        var dbo = db.db("mydb");
        dbo.collection("log").insertOne({ workout_name: req.body.workout_name, exercises: req.body.exercises, user: req.session.user, timestamp: Date.now() }, function (err, result) {
            if (err) return res.status(500).end(err);
            res.json("new work out added");
            db.close();
        })
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// the following is for tensorflow training
// data process 
// util function to normalize a value between a given range.

function extractlog(workouts) {
    let accum_bench_set = 0;
    let accum_bench_rep = 0;
    let accum_bench_weight = 0;
    let accum_squat_set = 0;
    let accum_squat_rep = 0;
    let accum_squat_weight = 0;
    let accum_deadlift_set = 0;
    let accum_deadlift_rep = 0;
    let accum_deadlift_weight = 0;
    let curr_exercise;
    let count_bench = 0;
    let count_squat = 0;
    let count_deadlift = 0;
    for (i = 0; i < workouts.length; i++) {
        for (k = 0; k < workouts[i].exercises.length; k++) {
            curr_exercise = workouts[i].exercises[k];
            if (curr_exercise.exercise_name.trim().toLowerCase() == "bench" || curr_exercise.exercise_name.trim().toLowerCase() == "benchpress") {
                accum_bench_set = accum_bench_set + curr_exercise.sets;
                accum_bench_rep = accum_bench_rep + curr_exercise.reps;
                accum_bench_weight = accum_bench_weight + curr_exercise.weights.match(/\d+/g).map(Number);
                count_bench++;
            }
            else if (curr_exercise.exercise_name.trim().toLowerCase() == "squat" || curr_exercise.exercise_name.trim().toLowerCase() == "legpress") {
                accum_squat_set = accum_squat_set + curr_exercise.sets;
                accum_squat_rep = accum_squat_rep + curr_exercise.reps;
                accum_squat_weight = accum_squat_weight + curr_exercise.weights.match(/\d+/g).map(Number);
                count_squat++;
            }
            else if (curr_exercise.exercise_name.trim().toLowerCase() == "deadlift") {
                accum_deadlift_set = accum_deadlift_set + curr_exercise.sets;
                accum_deadlift_rep = accum_deadlift_rep + curr_exercise.reps;
                accum_deadlift_weight = accum_deadlift_weight + curr_exercise.weights.match(/\d+/g).map(Number);
                count_deadlift++;
            }
        }
    }

    if (count_bench == 0) { count_bench = 1 }
    if (count_deadlift == 0) { count_deadlift = 1 }
    if (count_squat == 0) { count_squat = 1 }
    return [accum_bench_rep / count_bench, accum_bench_set / count_bench, accum_bench_weight / count_bench,
    accum_squat_rep / count_squat, accum_squat_set / count_squat, accum_squat_weight / count_squat,
    accum_deadlift_rep / count_deadlift, accum_deadlift_set / count_deadlift, accum_deadlift_weight / count_deadlift]


}



app.get('/users/recommendation/', isAuthenticated, function (req, res, next) {
    //test_sample = [3, 3, 200, 2, 4, 200, 2, 2, 200];
    MongoClient.connect(url, function (err, db) {
        if (err) return res.status(500).end(err);
        var dbo = db.db("mydb");
        dbo.collection("log").find({ user: req.session.user }).toArray(function (err, result) {
            if (err) throw err;
            recommend = predictSample(extractlog(result))
            recommend.then(function (myresult) {
                res.json(myresult)
            })
            db.close();
        })
    });
});




function normalize(value, min, max) {
    if (min === undefined || max === undefined) {
        return value;
    }
    return (value - min) / (max - min);
}

// define timeout during training
const TIMEOUT_BETWEEN_EPOCHS_MS = 500;

// define data path
const TEST_DATA_PATH = 'https://storage.googleapis.com/liftlog/testing_data.csv';
const TRAIN_DATA_PATH = 'https://storage.googleapis.com/liftlog/training_data.csv';
// Constants from training data
const rep_MIN = 0;
const rep_MAX = 80;
const set_MIN = 0;
const set_MAX = 20;
const weight_MIN = 0;
const weight_MAX = 800;
const NUM_CLASS = 3;
const TRAINING_DATA_LENGTH = 24;
const TEST_DATA_LENGTH = 6;
// Converts a row from the CSV into features and labels.
// Each feature field is normalized within training data constants
const csvTransform =
    ({ xs, ys }) => {
        const values = [
            normalize(xs.bench_rep, rep_MIN, rep_MAX),
            normalize(xs.bench_sets, set_MIN, set_MAX),
            normalize(xs.bench_weight, weight_MIN, weight_MAX),
            normalize(xs.squat_rep, rep_MIN, rep_MAX),
            normalize(xs.squat_set, set_MIN, set_MAX),
            normalize(xs.squat_weight, weight_MIN, weight_MAX),
            normalize(xs.deadlift_rep, rep_MIN, rep_MAX),
            normalize(xs.deadlift_set, set_MIN, set_MAX),
            normalize(xs.deadlift_weight, weight_MIN, weight_MAX),
        ];
        return { xs: values, ys: ys.target };
    }


const trainingData =
    tf.data.csv(TRAIN_DATA_PATH, { columnConfigs: { target: { isLabel: true } } })
        .map(csvTransform)
        .shuffle(TRAINING_DATA_LENGTH)
        .batch(8);

// Load all training data in one batch to use for evaluation
const trainingValidationData =
    tf.data.csv(TRAIN_DATA_PATH, { columnConfigs: { target: { isLabel: true } } })
        .map(csvTransform)
        .batch(TRAINING_DATA_LENGTH);

// Load all test data in one batch to use for evaluation
const testValidationData =
    tf.data.csv(TEST_DATA_PATH, { columnConfigs: { target: { isLabel: true } } })
        .map(csvTransform)
        .batch(TEST_DATA_LENGTH);

// add model
// two layer feed forward neural network 
const model = tf.sequential();
model.add(tf.layers.dense({ units: 120, activation: 'relu', inputShape: [9] }));
model.add(tf.layers.dense({ units: 75, activation: 'relu' }));
model.add(tf.layers.dense({ units: NUM_CLASS, activation: 'softmax' }));

model.compile({
    optimizer: tf.train.adam(),
    loss: 'sparseCategoricalCrossentropy',
    metrics: ['accuracy']
});

// Returns pitch class evaluation percentages for training data 
// with an option to include test data
async function evaluate(useTestData) {
    let results = {};
    await trainingValidationData.forEachAsync(exerciseTypeBatch => {
        const values = model.predict(exerciseTypeBatch.xs).dataSync();
        const classSize = ~~TRAINING_DATA_LENGTH / NUM_CLASS;
        for (let i = 0; i < NUM_CLASS; i++) {
            results[ExerciseFromClassNum(i)] = {
                training: calcExerciseClassEval(i, classSize, values)
            };
        }
    });

    if (useTestData) {
        await testValidationData.forEachAsync(exerciseTypeBatch => {
            const values = model.predict(exerciseTypeBatch.xs).dataSync();
            const classSize = ~~TEST_DATA_LENGTH / NUM_CLASS;
            for (let i = 0; i < NUM_CLASS; i++) {
                results[ExerciseFromClassNum(i)].validation =
                    calcExerciseClassEval(i, classSize, values);
            }
        });
    }
    return results;
}

async function predictSample(sample) {
    let result = model.predict(tf.tensor(sample, [1, sample.length])).arraySync();
    var maxValue = 0;
    for (var i = 0; i < NUM_CLASS; i++) {
        if (result[0][i] > maxValue) {
            predicted_exe = i;
            maxValue = result[0][i];
        }
    }

    return ExerciseFromClassNum(predicted_exe);
}

// Determines accuracy evaluation for a given pitch class by index
function calcExerciseClassEval(exerciseIndex, classSize, values) {
    // Output has 3 different class values for each pitch, offset based on
    // which pitch class (ordered by i)
    let index = (exerciseIndex * classSize * NUM_CLASS) + exerciseIndex;
    let total = 0;
    for (let i = 0; i < classSize; i++) {
        total += values[index];
        index += NUM_CLASS;
    }
    return total / classSize;
}

// Returns the string value for Baseball pitch labels
function ExerciseFromClassNum(classNum) {
    switch (classNum) {
        case 0:
            return 'bench';
        case 1:
            return 'squat';
        case 2:
            return 'deadlift';
        case 3:
            return 'null';
    }
}

// boost the training 
// util function to sleep for a given ms
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {

    let numTrainingIterations = 5;
    for (var i = 0; i < numTrainingIterations; i++) {
        console.log(`Training iteration : ${i + 1} / ${numTrainingIterations}`);
        await model.fitDataset(trainingData, { epochs: 1 });
        console.log('accuracyPerClass', await evaluate(true));
        await sleep(TIMEOUT_BETWEEN_EPOCHS_MS);
    }

}
run();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const http = require('http');
const PORT = process.env.PORT || 3000;

http.createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});


