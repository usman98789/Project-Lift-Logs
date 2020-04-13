# Project Title: Lift Logs

## Table of Contents:
* [Team Members](#team)
* [Description](#desc)
* [Key features](#key-feat)
* [Additional Features](#add-feat)
* [Technologies](#tech)
* [Technical Challenges](#challenges)

## Team Members: <a name="team"></a>
### Jikai Long, Usman Siddiqui, Rahmatullah Nikyar

## Description: <a name="desc"></a>
Lift Logs is a mobile application that makes your gym life more organized and manageable. It provides services such as a workout tracker where it allows users to track and change their workout routine. It lets users create and store routines, workouts, and start a workout for today. It also includes charts to be able to see your growth in any of your exercises. In addition to that, Lift Logs can recommend different types of exercises based on user’s profile information while also providing guidelines for the workout using AR technologies. 

## Key features: <a name="key-feat"></a>

__Routine tracker__ - including daily, weekly and long term plans. This feature tracks user’s performance and displays their routines, workouts and logs every workout they do.

__Charts__ - A graph that displays workout performance for that exercise plotting your growth of how well you have been performing in the gym.

__Recommendation__ - This feature recommends users which workout routine works best for them based on their profile information of 3 main exercises Bench Press, Squats and Deadlift. It looks at their current progress and suggests which exercises they should do more.

## Additional features: <a name="add-feat"></a>
__AR__ - This AR features will project figures on machines and display correct motion of movement for corresponding exercises to help users learn and correct their forms.

## Technologies: <a name="tech"></a>
* _React Native_ - Mobile Frontend Framework
* _Node.js_ - Backend server
* _MongoDb_ - NoSQL database
* _React-Native-ARkit_ - React native based AR package
* _Tensorflow_ - Tensorflow is one of the best AI model training libraries that gives proper recommendation with optimized training process

## Technical Challenges: <a name="challenges"></a>
* Using the AR library efficiently and effectively to match our goal.
* Building our own 3D models for use in the AR library
* Tensorflow - how to host and speed up real time training server when parallel user requests are flowing into the backend
* Coming up with useful/meaningful analytics on workout data
* Creating meaningful workout advice and routines that will improve the user’s strength based on his/her past data 

# Deployment

## Mobile App
The Augmented Reality is only supported for iOS and so we recommend using an iOS device as the app is optimized for it.

To deploy mobile app, `cd LiftLogs` and use the command `expo start`. A browser window should open up.

From there ensure you have the Expo App downloaded on your mobile phone.

On the browser window thats opened, either use the url provied on your mobile phone's web browser or scan the QR code to be redirected into the expo app where the LiftLogs app mobile is contained.

(According to Piazza post this was sufficient as it costs $99USD to either put on the Store or use Apples Test Flight)
## Backend Server

### One time set-up
1. Ensure you have the heroku CLI installed: https://devcenter.heroku.com/articles/heroku-cli
2. Log into your heroku account with the command: `heroku login` (your account will need access to the heroku lift-logs app)
3. Run `heroku git:remote -a lift-logs`

### Deploy/Re-deploy command
In the root project directory run `$ git subtree push --prefix Server heroku master`
To see live errors in the deployment, or console.log output, run `heroku logs --tail`

### API Documentation
Here is the link to API Documentation: https://github.com/UTSCC09/project-lift-logs/blob/master/API_Doc.md

## Youtube Link
https://www.youtube.com/watch?v=QBwLzrR_9cs
