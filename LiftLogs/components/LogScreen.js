import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	SafeAreaView,
	FlatList,
	TouchableOpacity,
	ScrollView
} from "react-native";
import { Button, Overlay } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import backendUrl from "../config";

const LogEntry = props => {
	const [viewDetails, setViewDetails] = useState(false);

	let concatExerciseNames = exercises => {
		let exerciseNames = "";
		exercises.map(exercise => {
			exerciseNames = exerciseNames.concat(exercise.exercise_name, ", ");
		});
		exerciseNames = exerciseNames.slice(0, exerciseNames.length - 2);
		return exerciseNames;
	};

	return (
		<SafeAreaView>
			<TouchableOpacity
				onPress={() => setViewDetails(true)}
				activeOpacity={0.5}
				style={{ zIndex: 1 }}
			>
				<View style={styles.workout}>
					<Text style={{ fontSize: 19 }}>{props.workout.workout_name}</Text>
					<Text style={{ fontSize: 14 }}>
						{concatExerciseNames(props.workout.exercises)}
					</Text>
				</View>
			</TouchableOpacity>
			<Overlay isVisible={viewDetails} width="85%" height="25%">
				<ScrollView>
					<View
						style={{
							flex: 1,
							flexDirection: "row",
							justifyContent: "space-between"
						}}
					>
						<Text style={{ fontSize: 18, top: 5, fontWeight: "500" }}>
							{props.workout.workout_name}
						</Text>
						<TouchableOpacity
							activeOpacity={0.5}
							onPress={() => setViewDetails(false)}
							style={{
								paddingRight: 5
							}}
						>
							<Icon
								name="ios-close"
								size={40}
								style={{ top: -5, color: "#DC4A3A" }}
							/>
						</TouchableOpacity>
					</View>
					{props.workout.exercises.map(excercise => {
						return (
							<View key={excercise.exercise_name}>
								<Text style={{ fontSize: 16, fontWeight: "500" }}>
									{excercise.exercise_name}
								</Text>
								<View
									style={{
										flex: 1,
										flexDirection: "row",
										justifyContent: "space-between",
										paddingBottom: 10
									}}
								>
									<Text>Sets: {excercise.sets}</Text>
									<Text>Weight: {excercise.weights}</Text>
									<Text>Reps: {excercise.reps}</Text>
								</View>
							</View>
						);
					})}
				</ScrollView>
			</Overlay>
		</SafeAreaView>
	);
};

const LogScreen = props => {
	const [workoutArray, setWorkoutArray] = useState([]);

	const { navigation } = props;

	let localIPAddress = "";

	let getWorkouts = () => {
		fetch(`${backendUrl}/users/log`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			credentials: "include"
		})
			.then(resJson => resJson.json())
			.then(res => {
				setWorkoutArray(res);
			})
			.catch(error => {
				console.log(error);
				// error
				setWorkoutArray([]);
			});
	};

	useEffect(() => {
		getWorkouts();
		// add event listener to repull workout logs whenever this component is focused
		const unsubscribe = navigation.addListener("willFocus", e => {
			getWorkouts();
		});
	}, []);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Workout Logs</Text>
			</View>
			<FlatList
				data={workoutArray}
				renderItem={({ item, index }) => <LogEntry workout={item} />}
				// relies on item id beinng returned in the db object
				keyExtractor={item => item._id}
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
