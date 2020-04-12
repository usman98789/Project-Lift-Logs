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
import { FlatList } from "react-native-gesture-handler";
import ExerciseScreen from "./ExerciseScreen";
import AddExcercise from "../AddExcercise";
import { set } from "gl-matrix/src/gl-matrix/mat4";

const WorkoutScreen = props => {
	const [ExerciseOpen, setExerciseOpen] = useState(false);
	const [Exercises, setExercises] = useState([]);
	const [boolModal, setboolModal] = useState(false);
	const [exercise_name, setexName] = useState("");
	const [reps, setReps] = useState(0);
	const [weight, setWeight] = useState(0);
	const [sets, setSets] = useState(0);
	const [emptyOpen, setemptyOpen] = useState(false);

	let localIPAddress = "";

	const setExNamer = (x, i) => {
		let copyexArray = Exercises;
		copyexArray[i] = { ...copyexArray[i], exercise_name: x };
		setExercises(copyexArray);
	};

	const setWeights = (x, i) => {
		let copyexArray = Exercises;
		copyexArray[i] = { ...copyexArray[i], weights: x };
		setExercises(copyexArray);
	};

	const setREPS = (x, i) => {
		let copyexArray = Exercises;
		copyexArray[i] = { ...copyexArray[i], reps: x };
		setExercises(copyexArray);
	};

	const setCounter = (x, i) => {
		let copyexArray = Exercises;
		copyexArray[i] = { ...copyexArray[i], sets: x };
		setExercises(copyexArray);
	};

	const setExcerciseNamer = x => {
		setexName(x);
	};

	const setSetsNamer = x => {
		setSets(x);
	};

	const setWeightsNamer = x => {
		setWeight(x);
	};

	const setRepsNamer = x => {
		setReps(x);
	};

	const addEX = () => {
		setExercises(exArray => [
			...exArray,
			{
				exercise_name: "",
				reps: "",
				sets: "",
				weights: ""
			}
		]);
	};

	function sendNewExercise() {
		fetch(`http://${localIPAddress}:3000/users/exercises/${props._id}`, {
			method: "POST",
			body: JSON.stringify({
				exercise_name: exercise_name,
				sets: sets,
				reps: reps,
				weights: weight
			}),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			credentials: "include"
		})
			.then(resJson => resJson.json())
			.then(res => {
				getExercises();
			})
			.catch(e => {
				console.log(e);
			});
	}

	function getExercises() {
		fetch(
			`http://${localIPAddress}:3000/users/workouts/${props.routine_id}/${props._id}`,
			{
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				credentials: "include"
			}
		)
			.then(resJson => resJson.json())
			.then(res => {
				setExercises(res[0].exercises);
			})
			.catch(e => console.log(e));
	}

	useEffect(() => {
		getExercises();
	}, [ExerciseOpen]);

	function sendLogReqTempWorkout() {
		fetch(`http://${localIPAddress}:3000/users/log`, {
			method: "PATCH",
			body: JSON.stringify({
				workout_name: props.workout_name,
				exercises: Exercises
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

	return (
		<SafeAreaView style={styles.container}>
			<View
				style={{
					paddingTop: 10,
					width: "90%",
					flex: 1,
					alignSelf: "center"
				}}
			>
				<Button
					titleStyle={{ fontWeight: "bold" }}
					buttonStyle={{
						backgroundColor: "#51CCF2"
					}}
					title={props.workout_name}
					onPress={() => setExerciseOpen(true)}
				/>
			</View>

			<Modal visible={ExerciseOpen} animationType="slide">
				<SafeAreaView>
					<View style={styles.routineHeader}>
						<Text style={styles.routineTitle}>Add Excercises (Preplan)</Text>
						<TouchableOpacity
							activeOpacity={0.5}
							style={styles.TouchableOpacity}
							onPress={() => setboolModal(true)}
						>
							<Icon name="ios-add" size={40} style={styles.icon} />
						</TouchableOpacity>
					</View>
					<Overlay isVisible={boolModal} width="80%" height="30%">
						<View>
							<TextInput
								style={{ padding: 15, color: "black", fontSize: 18 }}
								placeholder="Excercise Name"
								placeholderTextColor="#A0A0A0"
								onChangeText={text => setExcerciseNamer(text)}
							/>
							<TextInput
								style={{ padding: 15, color: "black", fontSize: 16 }}
								placeholder="Sets"
								placeholderTextColor="#A0A0A0"
								onChangeText={text => setSetsNamer(text)}
								keyboardType="number-pad"
							/>
							<TextInput
								style={{ padding: 15, color: "black", fontSize: 16 }}
								placeholder="Weights"
								placeholderTextColor="#A0A0A0"
								onChangeText={text => setWeightsNamer(text)}
								keyboardType="number-pad"
							/>
							<TextInput
								style={{ padding: 15, color: "black", fontSize: 16 }}
								placeholder="Reps"
								placeholderTextColor="#A0A0A0"
								onChangeText={text => setRepsNamer(text)}
								keyboardType="number-pad"
							/>
							<View style={{ paddingBottom: 20 }}>
								<Button
									title="Done"
									buttonStyle={{ backgroundColor: "#2dcc70" }}
									onPress={() => {
										setboolModal(false);
										sendNewExercise();
									}}
								/>
							</View>
						</View>
					</Overlay>
					<View style={{ height: "75%" }}>
						<FlatList
							data={Exercises}
							renderItem={({ item }) => {
								console.log('check inside overlay flatlist before add', item)
								return (
									<ExerciseScreen
										_id={item._id}
										exercise_name={item.exercise_name}
										reps={item.reps}
										sets={item.sets}
										weights={item.weights}
									/>
								);
							}}
							keyExtractor={item => item._id}
							extraData={Exercises}
						/>
					</View>
					<View style={{ paddingTop: 10 }}>
						<Button
							titleStyle={{ fontWeight: "bold" }}
							buttonStyle={{ backgroundColor: "#2dcc70" }}
							title="Start Workout"
							onPress={() => {
								setExerciseOpen(false);
								setemptyOpen(true);
							}}
						/>
					</View>
					<View style={{ paddingTop: 10 }}>
						<Button
							titleStyle={{ fontWeight: "bold" }}
							buttonStyle={{ backgroundColor: "#24a0ed" }}
							title="Back to Workouts"
							onPress={() => setExerciseOpen(false)}
						/>
					</View>
				</SafeAreaView>
			</Modal>

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
							style={{
								zIndex: 1,
								right: -15,
								flexDirection: "row",
								justifyContent: "space-between"
							}}
						>
							<Icon name="ios-close" size={55} style={{ color: "#DC4A3A" }} />
							<View style={{ paddingTop: 5 }}>
								<Button
									buttonStyle={{ backgroundColor: "#2dcc70" }}
									onPress={() => {
										sendLogReqTempWorkout();
										setemptyOpen(false);
									}}
									style={styles.saveButton}
									title="Done"
								/>
							</View>
						</TouchableOpacity>

						<Text
							style={{
								padding: 5,
								color: "black",
								fontSize: 22,
								fontWeight: "bold",
								alignSelf: "center"
							}}
						>
							{props.workout_name}
						</Text>
					</View>
					<KeyboardAvoidingView behavior="padding">
						<View style={{ height: "80%", paddingTop: 10 }}>
							<FlatList
								data={Exercises}
								renderItem={(item, index) => {
									return (
										<AddExcercise
											key={item.item._id}
											keyval={item.index}
											val={item.item}
											weights={setWeights}
											reps={setREPS}
											setCount={setCounter}
											exercise_name={setExNamer}
										/>
									);
								}}
								keyExtractor={(item, index) => {
									return index.toString();
								}}
								extraData={Exercises}
							/>
						</View>
						<Button
							buttonStyle={{ backgroundColor: "#24a0ed" }}
							style={styles.exButton}
							title="Add an Excercise"
							onPress={addEX}
							titleStyle={{ fontWeight: "bold" }}
						/>
					</KeyboardAvoidingView>
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
		fontSize: 20,
		fontWeight: "bold"
	},
	TouchableOpacity: {
		zIndex: 1,
		left: -15,
		paddingTop: 20
	},
	saveButton: {
		paddingRight: 27,
		height: 50
	},
	exButton: {
		width: "90%",
		alignSelf: "center",
		paddingBottom: 40
	},
	panel: {
		borderColor: "#BFBFBF",
		borderTopWidth: 1,
		paddingBottom: 20
	},
	exInput: {
		borderBottomColor: "#BFBFBF",
		height: 50,
		fontSize: 19,
		right: -30,
		color: "black"
	},
	addSet: {
		borderColor: "#BFBFBF",
		borderBottomWidth: 1
	},
	input2: {
		right: -72,
		color: "black",
		fontSize: 17
	},
	reps: {
		left: 166,
		color: "black",
		fontSize: 17,
		position: "absolute"
	},
	box: {
		borderColor: "#BFBFBF",
		backgroundColor: "white"
	},
	above: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginTop: 8,
		right: -30,
		flex: 1
	}
});

export default WorkoutScreen;
