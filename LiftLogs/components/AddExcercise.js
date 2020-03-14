import React, { useState } from "react";
import { View, TextInput, StyleSheet, Button } from "react-native";
import AddSet from "./AddSet";

const AddExcercise = props => {
	const [setsArray, setSetsArray] = useState([]);
	const [weight, setWeight] = useState("");
	const [reps, setReps] = useState("");
	const [setCount, setSetsCount] = useState(0);

	const setWeights = weight => {
		setWeight(weight);
	};

	const setRep = reps => {
		setReps(reps);
	};

	const addSets = () => {
		setSetsCount(setCount + 1);

		setSetsArray(setsArray => [
			...setsArray,
			{ SetCount: setCount, Weight: weight, Reps: reps }
		]);
		props.setsArray(setsArray);
		console.log(setsArray);
	};

	let sets = setsArray.map((val, key) => {
		return (
			<AddSet
				count={setCount}
				weight={setWeights}
				rep={setRep}
				key={key}
				keyval={key}
				val={val}
			/>
		);
	});
	return (
		<View key={props.keyval} style={styles.panel}>
			<TextInput
				selectionColor="blue"
				style={styles.exInput}
				placeholder="Excercise Name"
				placeholderTextColor="#a9a9a9"
				maxLength={30}
				multiline={false}
				onChangeText={props.exName}
			/>
			<AddSet count={setCount} weight={setWeights} rep={setRep} />
			{sets}
			<View style={styles.addSet}>
				<Button title="Add Set" color="#2163f6" onPress={addSets}></Button>
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
		right: -30
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
