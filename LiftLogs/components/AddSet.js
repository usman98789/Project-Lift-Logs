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

			<View style={[styles.above, { marginBottom: 10 }]}>
				<TextInput
					selectionColor="blue"
					placeholder="0"
					style={{ position: "absolute", color: "black", fontSize: 17 }}
					placeholderTextColor="#a9a9a9"
					onChangeText={props.count}
					keyboardType="number-pad"
					maxLength={3}
				/>
				<TextInput
					selectionColor="blue"
					style={styles.input2}
					placeholder="0"
					placeholderTextColor="#a9a9a9"
					onChangeText={props.weight}
					keyboardType="number-pad"
					maxLength={4}
				/>
				<TextInput
					selectionColor="blue"
					style={[styles.reps]}
					placeholder="0"
					placeholderTextColor="#a9a9a9"
					onChangeText={props.rep}
					// backgroundColor="red"
					keyboardType="number-pad"
					maxLength={2}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	input2: {
		right: -72,
		color: "black",
		fontSize: 17
	},
	reps: {
		// right: 235,
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

export default AddSet;
