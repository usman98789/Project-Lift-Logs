# API Documentation 

## Objects

### Routine
* _id: string - an ID generated from backend
* routine_name: string - a routine_name
* user: string -session user

### Workout
* _id: string - an ID generated from backend
* workout_nmae: string - a workout name
* routine_id: string - a _id of a routine where workout is attached to
* exercises: array - an array of exercises within that routine

### Exercise
* _id: string - an ID generated from backend
* exercise_name:string - an exercise name
* sets: int - exercise sets
* reps: int - exercise reps
* weight: string - exercise weight

## REQUESTS

### client
* POST - /signup/: sign up a user given username and password
* POST - /signin/: sign in a user given username and password
* GET - /signout/: sign out current user

### create
* POST - /users/routines/ - add a routine given routine_name
* POST - /users/routines/:id/workouts/ - add a workout to a routine with id given workout_name
* POST - /users/routines/workouts/:id/exercises/ - add a exercise to a workout with id given exercise_name, sets, reps and weights

### read
* GET - /users/routines/ - get all routines from current user
* GET - /users/routines/:id/workouts/ - get all workouts given routine id
* GET - /users/routines/:id/workouts/:workout_id/ - get one workout given routine id and workout_id
* GET - /users/log/ - get a log from current user
* GET - /users/recommendation/ -get a recommendation for current user

### delete
* DELETE - /users/routines/:id/ - delete a routine given routine id
* DELETE - /users/routines/workouts/:id/ - delete a workout given workout id
* DELETE - /users/routines/workouts/:id/exercises/:exercise_id/ - delete an exercise given workout id and exercise_id
* DELETE - /users/log/:id/ - delete a workout from log given workout id

### write
* PATCH - /users/routines/:id/ - modify a routines name given routine id
* PATCH - /users/routines/workouts/:id/ - modify a workout (including workout_name and exercises) given workout id
* PATCH - /users/log/ - add a workout to log given a workout (including workout_name and exercises) 










