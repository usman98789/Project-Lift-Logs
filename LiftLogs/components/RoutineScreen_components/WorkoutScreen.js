import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	Modal,
	TextInput
} from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { FlatList } from "react-native-gesture-handler";
import ExerciseScreen from "./ExerciseScreen";



const WorkoutScreen = props => {


	const [ExerciseOpen, setExerciseOpen] = useState(false);
	const [Exercises, setExercises] = useState([]);
	useEffect(() => {
		setExercises([{_id: "1", exercise_name: "flat bench press", user: "jack", reps: "50", sets: "10", weights: "100lb"},
					{_id: "2", exercise_name: "legs press", user: "jack", reps: 50, sets:"10", weights: "100lb"}]);
	  },[]);
	
	return (
		<SafeAreaView style={styles.container}>
			<View>
				<Button
						titleStyle={{ fontWeight: "bold" }}
						buttonStyle={{ backgroundColor: "#091242" }}
						title={props.workout_name}
						onPress={() => setExerciseOpen(true)}
				/>
			</View>
			<Modal visible={ExerciseOpen} animationType="slide">
				<SafeAreaView>
					<Button
					titleStyle={{ fontWeight: "bold" }}
					buttonStyle={{ backgroundColor: "#008000" }}
					title= "Back to Workouts"
					onPress={() => setExerciseOpen(false)}
				/>
					<View>
						<FlatList data = {Exercises} 
								renderItem = {({item}) => <ExerciseScreen  _id = {item._id} exercise_name = {item.exercise_name} user = {item.user} 
															reps = {item.reps} sets = {item.sets} weights = {item.weights}/>}
								keyExtractor={(item) => item._id}
								extraData = {Exercises}
								/>
					</View>
				</SafeAreaView>
			</Modal>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	workoutTitle: {
		paddingTop: 15,
		color: "black",
		fontSize: 20,
		fontWeight: "bold"
	},
	container: {
		flex: 1
	},
	button: {
		width: "90%",
		alignSelf: "center",
		fontWeight: "bold"
	},
	workoutHeader: {
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
		justifyContent: "space-between",
		borderBottomColor: "#F0EFF5",
		borderBottomWidth: 2
	}
});

export default WorkoutScreen;