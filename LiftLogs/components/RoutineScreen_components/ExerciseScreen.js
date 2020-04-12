import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";

const ExerciseScreen = props => {
	return (
		<SafeAreaView>
			<View style={styles.workout}>
				<Text style={{ fontSize: 21 }}>{props.exercise_name}</Text>
				<View
					style={{
						flexDirection: "row",
						paddingTop: 10,
						justifyContent: "space-between"
					}}
				>
					<Text style={{ fontSize: 16 }}>Sets : {props.sets} </Text>
					<Text style={{ fontSize: 16 }}>Weights: {props.weights} </Text>
					<Text style={{ fontSize: 16 }}>Reps: {props.reps} </Text>
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	workout: {
		marginTop: 15,
		right: -20,
		width: "90%",
		height: 85,
		borderRadius: 5,
		padding: 15,
		backgroundColor: "#F5F5F5"
	}
});

export default ExerciseScreen;
