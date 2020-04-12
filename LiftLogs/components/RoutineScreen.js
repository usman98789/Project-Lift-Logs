import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	Modal,
	TextInput,
	KeyboardAvoidingView
} from "react-native";
import { Button, Overlay } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import AddExcercise from "./AddExcercise";
import Routine from "./RoutineScreen_components/Routine";
import { FlatList } from "react-native-gesture-handler";

const RoutineScreen = props => {
	const [emptyOpen, setemptyOpen] = useState(false);
	const [date, setDate] = useState(new Date());
	const [exArray, setexArray] = useState([]);
	const [workoutName, setWorkoutName] = useState("");
	const [weight, setWeight] = useState("");
	const [reps, setReps] = useState("");
	const [setCount, setSetsCount] = useState(0);
	const [exercise_name, setexName] = useState("");
	const [routines, setRoutine] = useState([]);
	const [boolModal, setboolModal] = useState(false);
	const [routineName, setRoutineName] = useState("");

	const setRoutineNamer = x => {
		setRoutineName(x);
	};

	// for using your physical phone, add your ip address
	let localIPAddress = "";

	const addEX = () => {
		setexArray(exArray => [
			...exArray,
			{ weights: weight, reps, sets: setCount, exercise_name: exercise_name }
		]);
	};

	const setExNamer = (x, i) => {
		let copyexArray = exArray;
		copyexArray[i] = { ...copyexArray[i], exercise_name: x };
		setexArray(copyexArray);
	};

	const setWorkoutNamer = x => {
		setWorkoutName(x);
	};

	const setWeights = (x, i) => {
		let copyexArray = exArray;
		copyexArray[i] = { ...copyexArray[i], weights: x };
		setexArray(copyexArray);
	};

	const setREPS = (x, i) => {
		let copyexArray = exArray;
		copyexArray[i] = { ...copyexArray[i], reps: x };
		setexArray(copyexArray);
	};

	const setCounter = (x, i) => {
		let copyexArray = exArray;
		copyexArray[i] = { ...copyexArray[i], sets: x };
		setexArray(copyexArray);
	};

	const addRoutineArray = i => {
		if (routineName.length > 0) {
			setRoutine(routineArray => [
				...routineArray,
				{ _id: i, routine_name: routineName }
			]);
			setRoutineName("");
		}
	};
	function sendLogReqTempWorkout(workoutName, exArray) {
		if (workoutName === "") {
			tempWorkoutName = date.toDateString();
		} else {
			tempWorkoutName = workoutName;
		}

		setexArray([]);
		setWorkoutName("");

		fetch(`http://${localIPAddress}:3000/users/log`, {
			method: "PATCH",
			body: JSON.stringify({
				workout_name: tempWorkoutName,
				exercises: exArray
			}),
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

	function sendNewRoutine() {
		fetch(`http://${localIPAddress}:3000/users/routines/`, {
			method: "POST",
			body: JSON.stringify({
				routine_name: routineName
			}),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			credentials: "include"
		})
			.then(resJson => resJson.json())
			.then(res => {
				let resobj = res.ops[0];
				addRoutineArray(resobj._id);
			})
			.catch(e => console.log(e));
	}

	function getRoutines() {
		fetch(`http://${localIPAddress}:3000/users/routines/`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			credentials: "include"
		})
			.then(resJson => resJson.json())
			.then(res => setRoutine(res))
			.catch(e => console.log(e));
	}

	useEffect(() => {
		if (!emptyOpen) {
			setexArray([]);
			setWorkoutName("");
		}
	}, [emptyOpen]);

	useEffect(() => {
		getRoutines();
		const unsubscribe = props.navigation.addListener("willFocus", e => {
			getRoutines();
		});
	}, []);

	let EXs = exArray.map((val, key) => {
		return (
			<AddExcercise
				key={key}
				keyval={key}
				val={val}
				weights={setWeights}
				reps={setREPS}
				setCount={setCounter}
				exercise_name={setExNamer}
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
							placeholder={date.toDateString()}
							placeholderTextColor="grey"
							maxLength={30}
							multiline={false}
							onChangeText={setWorkoutNamer}
						/>
					</View>
					<KeyboardAvoidingView behavior="padding">
						<ScrollView style={{ height: "100%" }}>
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
					</KeyboardAvoidingView>
				</SafeAreaView>
			</Modal>
			<View style={styles.routines}>
				<View style={styles.routineHeader}>
					<Text style={styles.routineTitle}>Routines & Plans</Text>
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={() => setboolModal(true)}
						style={styles.TouchableOpacity}
					>
						<Icon name="ios-add" size={40} style={styles.icon} />
					</TouchableOpacity>
				</View>
				<Overlay isVisible={boolModal} width="80%" height="15%">
					<View>
						<TextInput
							style={{ padding: 15, color: "black", fontSize: 21 }}
							placeholder="Routine Name"
							placeholderTextColor="#A0A0A0"
							onChangeText={text => setRoutineNamer(text)}
						/>
						<Button
							title="Done"
							buttonStyle={{ backgroundColor: "#2dcc70" }}
							onPress={() => {
								setboolModal(false);
								sendNewRoutine();
							}}
						/>
					</View>
				</Overlay>
				<View style={{ height: "79%" }}>
					<FlatList
						data={routines}
						renderItem={({ item }) => (
							<Routine _id={item._id} routine_name={item.routine_name} />
						)}
						keyExtractor={item => item._id}
						extraData={routines}
					/>
				</View>
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
		alignSelf: "center",
		paddingBottom: 40
	}
});

export default RoutineScreen;
