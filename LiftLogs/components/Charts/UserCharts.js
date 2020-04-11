import React, { useState, useEffect } from "react";
import { View, StyleSheet, Picker, Dimensions, Text } from "react-native";
import { Button } from "react-native-elements";
import { LineChart } from "react-native-chart-kit";

const UserCharts = props => {
  const [userExercises, setUserExercises] = useState(["bench", "shoulderpress"]);
  const [selectedEx, setSelectedEx] = useState(userExercises[0] || null);
  const [selectedExWeight, setSelectedExWeight] = useState([]);

  const getExercises = () => {
    // for using your physical phone, add your ip address
    let localIPAddress = "";
    fetch(`http://${localIPAddress}:3000/users/log`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then(resJson => resJson.json())
      .then(logs => {
        // console.log({ "res": res });
        let exerciseList = [];
        logs.map(workout => {
          workout.exercises.map(exercise => {
            exerciseList.push(exercise.exName);
          });
        })
        console.log({ "exerciselist": exerciseList });
        setUserExercises([... new Set(exerciseList)]);
      })
      .then(() => {
        // also set the default value for selectedEx
        setSelectedEx(userExercises[0]);
      })
      .catch(error => {
        console.log(error);
        // error
        setUserExercises([]);
      });
  }

  const getExerciseWeightData = () => {
    let name = selectedEx;
    let localIPAddress = "192.168.0.163";
    fetch(`http://${localIPAddress}:3000/users/log`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then(resJson => resJson.json())
      .then(logs => {
        // console.log({ "res": res });
        // console.log(logs);
        let weightValues = [];
        logs.map(workout => {
          // if exercise does not have same name, null is put in place of weight
          workout.exercises.map(exercise => {
            if (exercise.exName === name) {
              weightValues.push(exercise.weight)
            }
          });
        });
        console.log({ "name": name });
        console.log(weightValues);
        // remove the nulls and set state
        // return weightValues.filter(w => !w ? false : true);
        setSelectedExWeight(weightValues.filter(w => !w ? false : true));
      })
      .catch(error => {
        console.log(error);
        // error
        setUserExercises([]);
      });
  }

  const generatePickerItems = exs => {
    return exs.map(ex => <Picker.Item key={ex} label={ex} value={ex} />)
  }

  const chartConfig = {
    backgroundGradientFrom: "#abd1ff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#0",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5
  };

  const generateLineChartData = () => {
    let data = {
      labels: ["1", "2"],
      datasets: [
        {
          data: selectedExWeight,
          color: (opacity = 1) => `rgba(50, 65, 244, ${opacity})`, // optional
          strokeWidth: 3 // optional
        }
      ],
    };
    return data;
  }

  useEffect(() => {
    getExercises();
  }, [])
  return (
    <View style={styles.container}>
      <Text style={{ top: 75, fontSize: 20, fontWeight: '600', alignSelf: 'center' }}>Select an Exercise</Text>
      <Picker
        selectedValue={selectedEx}
        onValueChange={(itemValue, itemIndex) => setSelectedEx(itemValue)}
      >
        {generatePickerItems(userExercises)}
      </Picker>
      <View style={styles.button}>
        <Button // has padding bottom to avoid collision with sign up
          titleStyle={{ fontWeight: "bold" }}
          // buttonStyle={{ backgroundColor: "#32a86d" }}
          buttonStyle={{ backgroundColor: "#0bbd52" }}
          onPress={getExerciseWeightData}
          title="Generate Charts"
        />
      </View>
      {/* this boolean might be unnecessary */}
      {(selectedExWeight.length > 0) && (
        <View style={{ alignSelf: 'center' }}>
          <LineChart
            // data={{ data: selectedExWeight }}
            data={generateLineChartData()}
            width={Dimensions.get('window').width / 1.25} // from react-native
            height={250}
            chartConfig={chartConfig}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // marginTop: 40
    flex: 1
  },
  header: {
    top: 70,
    fontSize: 20
  },
  button: {
    width: "80%",
    alignSelf: "center",
    fontWeight: "bold",
    padding: 10,
    marginBottom: 20
  },
});
export default UserCharts;

