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
import { Button, Overlay } from "react-native-elements";
import WorkoutScreen from "./WorkoutScreen";
import { FlatList } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import backendUrl from "../../config";

const Routine = props => {
	const [WorkoutOpen, setWorkoutOpen] = useState(false);
	const [workouts, setWorkouts] = useState([]);
	const [boolModal, setboolModal] = useState(false);
	const [workoutName, setworkoutName] = useState("");

	const setWorkoutNamer = x => {
		setworkoutName(x);
	};

	function sendNewWorkout() {
		fetch(`${backendUrl}/users/routines/${props._id}/workouts`, {
			method: "POST",
			body: JSON.stringify({
				workout_name: workoutName
			}),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			credentials: "include"
		})
			.then(resJson => resJson.json())
			.then(res => {
				addWorkoutArray(res.ops[0]._id);
			})
			.catch(e => {
				console.log(e);
			});
	}

	function getWorkouts() {
		fetch(`${backendUrl}/users/routines/${props._id}/workouts`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			credentials: "include"
		})
			.then(resJson => resJson.json())
			.then(res => {
				setWorkouts(res);
			})
			.catch(e => console.log(e));
	}

	useEffect(() => {
		getWorkouts();
	}, [WorkoutOpen]);

	function addWorkoutArray(i) {
		if (workoutName.length > 0) {
			setWorkouts(workoutArray => [
				...workoutArray,
				{ _id: i, workout_name: workoutName }
			]);
			setworkoutName("");
		}
	}
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.button}>
				<Button
					titleStyle={{ fontWeight: "bold" }}
					buttonStyle={{ backgroundColor: "#51CCF2" }}
					title={props.routine_name}
					onPress={() => setWorkoutOpen(true)}
				/>
			</View>
			<Modal visible={WorkoutOpen} animationType="slide">
				<SafeAreaView style={{ flex: 1 }}>
					<View style={styles.routineHeader}>
						<Text style={styles.routineTitle}>Add Workouts to Routine</Text>
						<TouchableOpacity
							activeOpacity={0.5}
							style={styles.TouchableOpacity}
							onPress={() => setboolModal(true)}
						>
							<Icon name="ios-add" size={40} style={styles.icon} />
						</TouchableOpacity>
					</View>
					<Overlay isVisible={boolModal} width="80%" height="18%">
						<View>
							<TextInput
								style={{ padding: 15, color: "black", fontSize: 21 }}
								placeholder="Ex. Chest Day"
								placeholderTextColor="#A0A0A0"
								onChangeText={text => setWorkoutNamer(text)}
							/>
							<Button
								title="Done"
								buttonStyle={{ backgroundColor: "#2dcc70" }}
								onPress={() => {
									setboolModal(false);
									sendNewWorkout();
								}}
							/>
						</View>
					</Overlay>
					<View style={{ height: "78%", paddingTop: 10 }}>
						<FlatList
							data={workouts}
							renderItem={({ item }) => (
								<WorkoutScreen
									_id={item._id}
									workout_name={item.workout_name}
									routine_id={props._id}
								/>
							)}
							keyExtractor={item => item._id}
							extraData={workouts}
						/>
					</View>
					<View style={{ paddingTop: 10 }}>
						<Button
							titleStyle={{ fontWeight: "bold" }}
							buttonStyle={{
								backgroundColor: "#24a0ed"
							}}
							title="Back to Routine"
							onPress={() => setWorkoutOpen(false)}
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
		fontWeight: "bold",
		paddingTop: 10,
		width: "95%"
	},
	routineHeader: {
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
		justifyContent: "space-between",
		borderBottomColor: "#F0EFF5",
		borderBottomWidth: 2,
		paddingLeft: 15
	},
	routineTitle: {
		paddingTop: 20,
		color: "black",
		fontSize: 22,
		fontWeight: "bold"
	},
	TouchableOpacity: {
		zIndex: 1,
		left: -15,
		paddingTop: 20
	}
});

export default Routine;
