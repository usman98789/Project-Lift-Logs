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
import AddExcercise from "./AddExcercise";
import Routine from "./RoutineScreen_components/Routine";
import { FlatList } from "react-native-gesture-handler";

const RoutineScreen = props => {
	const [emptyOpen, setemptyOpen] = useState(false);
	const [date, setDate] = useState(new Date());
	const [exArray, setexArray] = useState([]);
	const [workoutName, setWorkoutName] = useState("");
	// const [setsArray, setsetsArray] = useState([]);
	const [weight, setWeight] = useState("");
	const [reps, setReps] = useState("");
	const [setCount, setSetsCount] = useState(0);
	const [exName, setexName] = useState("");
	const [routines, setRoutine] = useState([]);
	useEffect(() => {
		
		setRoutine([{_id: "1", routine_name: "big man on campus", user: "jack"},
					{_id: "2", routine_name: "big man on campus 2", user: "jack"}]);
	  },[]);
	

	// for using your physical phone, add your ip address
	let localIPAddress = "";

	const addEX = () => {
		setexArray(exArray => [...exArray, { weight, reps, setCount, exName }]);
	};

	const setExNamer = x => {
		setexName(x);
	};

	const setWorkoutNamer = x => {
		setWorkoutName(x);
	};

	const setWeights = y => {
		setWeight(y);
	};

	const setREPS = y => {
		setReps(y);
	};

	const setCounter = y => {
		setSetsCount(y);
	};





	function sendLogReqTempWorkout(workoutName, exArray) {
		console.log("exName is", exName);
		console.log("weight", weight);
		console.log("reps", reps);
		console.log("setCount", setCount);
		setexArray(exArray => [...exArray, { weight, reps, setCount, exName }]);
		console.log("EX ARRAY IS", exArray);
		// setexArray(exArray.shift());
		if (workoutName !== "" && exArray.length !== 0) {
			fetch(`http://${localIPAddress}:3000/users/log`, {
				method: "PATCH",
				body: JSON.stringify({ workout_name: workoutName, exercises: exArray }),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				credentials: "include"
			})
				.then(resJson => resJson.json())
				.then(res => console.log(res))
				.catch(e => console.log(e));
		}
	}

	let EXs = exArray.map((val, key) => {
		return (
			<AddExcercise
				key={key}
				keyval={key}
				val={val}
				weight={setWeights}
				reps={setREPS}
				setCount={setCounter}
				exName={setExNamer}
			/>
		);
	});

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Start Workout</Text>
			</View>
			<View style={styles.button}>
				<Button
					titleStyle={{ fontWeight: "bold" }}
					buttonStyle={{ backgroundColor: "#24a0ed" }}
					onPress={() => setemptyOpen(true)}
					title="Start an Empty Workout"
				/>
			</View>
			<Modal visible={emptyOpen} animationType="slide">
				<SafeAreaView>
					<View
						style={{
							borderBottomColor: "#F0EFF5",
							borderBottomWidth: 2
						}}
					>
						<TouchableOpacity
							activeOpacity={0.5}
							onPress={() => setemptyOpen(false)}
							style={styles.TouchableOpacity}
						>
							<Icon name="ios-close" size={55} style={{ color: "#DC4A3A" }} />
							<Button
								buttonStyle={{ backgroundColor: "#2dcc70" }}
								onPress={() => {
									sendLogReqTempWorkout(workoutName, exArray);
									setemptyOpen(false);
								}}
								style={styles.saveButton}
								title="Save"
							/>
						</TouchableOpacity>

						<TextInput
							selectionColor="blue"
							style={styles.workoutTitle}
							placeholder={date.toDateString() + "'s Workout"}
							placeholderTextColor="grey"
							maxLength={30}
							multiline={false}
							onChangeText={setWorkoutNamer}
						/>
					</View>
					<ScrollView>
						<View style={{ flex: 1 }}>
							<View style={{ marginTop: 30, flexDirection: "column" }}>
								{EXs}
							</View>
							<Button
								buttonStyle={{ backgroundColor: "#24a0ed" }}
								style={styles.exButton}
								title="Add an Excercise"
								onPress={addEX.bind(this)}
								titleStyle={{ fontWeight: "bold" }}
							/>
						</View>
					</ScrollView>
				</SafeAreaView>
			</Modal>
			<View style={styles.routines}>
				<View style={styles.routineHeader}>
					<Text style={styles.routineTitle}>Routines and Plans</Text>
					<TouchableOpacity activeOpacity={0.5} style={styles.TouchableOpacity}>
						<Icon name="ios-add" size={40} style={styles.icon} />
					</TouchableOpacity>
				</View>
					
				<FlatList data = {routines} 
						
						renderItem = {({item}) => <Routine _id = {item.id} routine_name = {item.routine_name} user = {item.user} />}
						extraData = {routines}
						/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	header: {
		top: 35,
		paddingLeft: 20
	},
	button: {
		top: 70,
		width: "90%",
		alignSelf: "center",
		fontWeight: "bold"
	},
	headerTitle: {
		fontSize: 28,
		fontWeight: "bold"
	},
	routines: {
		top: 90,
		paddingLeft: 20
	},
	routineTitle: {
		paddingTop: 15,
		color: "black",
		fontSize: 20,
		fontWeight: "bold"
	},
	routineHeader: {
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
		justifyContent: "space-between",
		borderBottomColor: "#F0EFF5",
		borderBottomWidth: 2
	},
	icon: {
		paddingRight: 30
	},
	TouchableOpacity: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		alignItems: "center",
		zIndex: 1,
		paddingTop: 15,
		left: 15
	},
	workoutTitle: {
		color: "black",
		fontSize: 24,
		fontWeight: "600",
		paddingBottom: 5,
		textAlign: "center",
		paddingTop: 15
	},
	saveButton: {
		paddingRight: 27,
		height: 50
	},
	exButton: {
		width: "90%",
		alignSelf: "center"
	}
});

export default RoutineScreen;
