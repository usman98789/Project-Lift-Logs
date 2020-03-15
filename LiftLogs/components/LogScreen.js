import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatLis,
  TouchableOpacity
} from "react-native";

const LogScreen = props => {
  const [workoutArray, setWorkoutArray] = useState([]);

  const { navigation } = props;

  let getWorkouts = () => {
    fetch("http://localhost:3000/users/log", {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then(resJson => resJson.json())
      .then(res => {
        console.log(res);
        setWorkoutArray(res);
      })
      .catch(e => console.log(e))
  }

  let concatExerciseNames = (exercises) => {
    console.log('yeet');
    let exerciseNames = "";
    exercises.map((exercise) => {
      exerciseNames = exerciseNames.concat(', ', exercise.exName);
    })
    console.log(exerciseNames);
    return exerciseNames;
  }

  // let reRender = true;

  // console.log('outside of use', navigation);


  useEffect(() => {
    getWorkouts();
    // add event listener to repull workout logs whenever this component is focused
    const unsubscribe = navigation.addListener('willFocus', e => {
      getWorkouts();
    });
  }, []);

  // workouts is an array of exercise objects
  let renderWorkoutLog = (workouts) => {
    return workouts.map((workout, index) => {

      return (
        <View key={index}>
          <TouchableOpacity activeOpacity={0.5} style={{ zIndex: 1 }}>
            <View style={styles.workout}>
              <Text style={{ fontSize: 19 }}>{workout.workout_name}</Text>
              <Text style={{ fontSize: 14 }}>
                {/* concatenate exercise names */}
                {concatExerciseNames(workout.exercises)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    })

  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workout Logs</Text>
      </View>
      {/* 
      <TouchableOpacity activeOpacity={0.5} style={{ zIndex: 1 }}>
        <View style={styles.workout}>
          <Text style={{ fontSize: 19 }}>Workout Name</Text>
          <Text style={{ fontSize: 14 }}>
            Bench Press, Squat, DeadLift, Shoulder Press
					</Text>
        </View>
      </TouchableOpacity> */}
      <View>
        {renderWorkoutLog(workoutArray)}
      </View>
      {/* <FlatList data={workoutArray} renderItem={({workout}) => (
			)}/> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    top: 35,
    paddingLeft: 20,
    paddingBottom: 10,
    position: "relative",
    borderBottomColor: "#F0EFF5",
    borderBottomWidth: 2
  },
  headerTitle: {
    color: "black",
    fontSize: 28,
    fontWeight: "bold"
  },
  workout: {
    marginTop: 60,
    right: -20,
    flexDirection: "column",
    width: "90%",
    height: 65,
    borderRadius: 5,
    padding: 15,
    backgroundColor: "white"
  }
});

export default LogScreen;
