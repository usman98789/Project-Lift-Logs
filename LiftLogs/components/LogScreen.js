import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const LogEntry = props => {

  let concatExerciseNames = (exercises) => {
    let exerciseNames = "";
    exercises.map((exercise) => {
      exerciseNames = exerciseNames.concat(', ', exercise.exName);
    })
    return exerciseNames;
  }

  return (
    <View>
      <TouchableOpacity activeOpacity={0.5} style={{ zIndex: 1 }}>
        <View style={styles.workout}>
          <Text style={{ fontSize: 19 }}>{props.workout.workout_name}</Text>
          <Text style={{ fontSize: 14 }}>
            {/* concatenate exercise names */}
            {concatExerciseNames(props.workout.exercises)}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const LogScreen = props => {
  const [workoutArray, setWorkoutArray] = useState([]);

  const { navigation } = props;

  let getWorkouts = () => {
    fetch("http://192.168.0.163:3000/users/log", {
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

  useEffect(() => {
    getWorkouts();
    // add event listener to repull workout logs whenever this component is focused
    const unsubscribe = navigation.addListener('willFocus', e => {
      getWorkouts();
    });
  }, []);

  // // workouts is an array of exercise objects
  // let renderWorkoutLog = (workouts) => {
  //   return workouts.map((workout, index) => {

  //     return (
  //       <View key={index}>
  //         <TouchableOpacity activeOpacity={0.5} style={{ zIndex: 1 }}>
  //           <View style={styles.workout}>
  //             <Text style={{ fontSize: 19 }}>{workout.workout_name}</Text>
  //             <Text style={{ fontSize: 14 }}>
  //               {/* concatenate exercise names */}
  //               {concatExerciseNames(workout.exercises)}
  //             </Text>
  //           </View>
  //         </TouchableOpacity>
  //       </View>
  //     )
  //   })
  // }

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workout Logs</Text>
      </View>
      {/* LogEntry */}
      <FlatList
        data={workoutArray}
        renderItem={({ item, index }) => <LogEntry workout={item} />}
        // relies on item id beinng returned in the db object
        keyExtractor={(item) => item._id}
      />
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
    borderBottomWidth: 2,
    marginBottom: 30
  },
  headerTitle: {
    color: "black",
    fontSize: 28,
    fontWeight: "bold"
  },
  workout: {
    marginTop: 15,
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
