import React, { useState } from "react";
import { View, StyleSheet, TextInput, Text } from "react-native";

const AddSet = props => {
	return (
		<View key={props.keyval} style={styles.box}>
			<View style={styles.above}>
				<Text style={{ color: "#2163f6" }}>Set</Text>
				<Text style={{ color: "#2163f6", left: 50 }}>Weight</Text>
				<Text style={{ color: "#2163f6", left: 100 }}>Reps</Text>
			</View>

			<View style={styles.above}>
				<Text>{props.count}</Text>
				<TextInput
					selectionColor="blue"
					style={[styles.input2, styles.weight]}
					placeholder="0"
					placeholderTextColor="#a9a9a9"
					onChangeText={props.weight}
					keyboardType="number-pad"
					maxLength={4}
				/>
				<TextInput
					selectionColor="blue"
					style={[styles.input2, styles.reps, styles.weight]}
					placeholder="0"
					placeholderTextColor="#a9a9a9"
					onChangeText={props.rep}
					keyboardType="number-pad"
					maxLength={4}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	input2: {
		fontSize: 19,
		right: -75
	},
	weight: {
		fontSize: 17
	},
	reps: {
		right: -158
	},
	box: {
		borderColor: "#BFBFBF",
		backgroundColor: "white"
	},
	above: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginTop: 6,
		right: -30
	}
});

export default AddSet;
