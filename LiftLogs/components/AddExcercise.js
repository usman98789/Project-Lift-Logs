import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Button } from "react-native";
import AddSet from "./AddSet";
import Icon from "react-native-vector-icons/Ionicons";

const AddExcercise = props => {
	const setExname = x => {
		props.exercise_name(x, props.keyval);
	};

	const setCounter = s => {
		props.setCount(s, props.keyval);
	};

	const setWeights = w => {
		props.weights(w, props.keyval);
	};

	const setRep = r => {
		props.reps(r, props.keyval);
	};

	return (
		<View key={props.keyval} style={styles.panel}>
			<TextInput
				selectionColor="blue"
				style={styles.exInput}
				placeholder={
					props.val.exercise_name ? props.val.exercise_name : "Excercise Name"
				}
				placeholderTextColor={props.val.exercise_name ? "#000000" : "#a9a9a9"}
				maxLength={30}
				multiline={false}
				onChangeText={setExname}
			/>
			<View style={styles.addSet}>
				<AddSet
					count={setCounter}
					weights={setWeights}
					rep={setRep}
					val={props.val}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
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
		color: "black",
		width: 370
	},
	addSet: {
		borderColor: "#BFBFBF",
		borderBottomWidth: 1
	},
	TouchableOpacity: {
		zIndex: 1
	}
});

export default AddExcercise;
