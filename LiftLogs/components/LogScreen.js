import React, { useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	SafeAreaView,
	FlatList,
	TouchableOpacity
} from "react-native";

const LogScreen = props => {
	const [workoutArray, setWorkoutArray] = useState([]);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Workout Logs</Text>
			</View>

			<TouchableOpacity activeOpacity={0.5} style={{ zIndex: 1 }}>
				<View style={styles.workout}>
					<Text style={{ fontSize: 19 }}>Workout Name</Text>
					<Text style={{ fontSize: 14 }}>
						Bench Press, Squat, DeadLift, Shoulder Press
					</Text>
				</View>
			</TouchableOpacity>

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
