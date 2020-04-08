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
import WorkoutScreen from "./WorkoutScreen";
import { FlatList } from "react-native-gesture-handler";


const Routine = props => {

	const [WorkoutOpen, setWorkoutOpen] = useState(false);
	const [workouts, setWorkouts] = useState([{_id: "1", workout_name: "bench", user: "jack"},
											{_id: "2", workout_name: "legs", user: "jack"}]);	
	useEffect(() => {
		setWorkouts([{_id: "1", workout_name: "bench", user: "jack"},
					{_id: "2", workout_name: "legs", user: "jack"}]);
	  },[]);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.button}>
				<Button
					titleStyle={{ fontWeight: "bold" }}
					buttonStyle={{ backgroundColor: "#008000" }}
					title={props.routine_name}
					onPress={() => setWorkoutOpen(true)}
				/>
			</View>
			<Modal visible={WorkoutOpen} animationType="slide">
				<SafeAreaView>
					<Button
					titleStyle={{ fontWeight: "bold" }}
					buttonStyle={{ backgroundColor: "#008000" }}
					title= "Back to Routine"
					onPress={() => setWorkoutOpen(false)}
				/>
				<View>
				<FlatList data = {workouts} 
						renderItem = {({item}) => <WorkoutScreen  _id = {item._id} workout_name = {item.workout_name} user = {item.user} />}
						keyExtractor={(item) => item._id}
						extraData = {workouts}
						/>
				</View>
				</SafeAreaView>

			</Modal>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	button: {
		width: "90%",
		alignSelf: "center",
		fontWeight: "bold"
	}
});

export default Routine;
