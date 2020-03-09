import React from "react";
import { View, StyleSheet, Text, SafeAreaView, Button } from "react-native";

const RoutineScreen = props => {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Start Workout</Text>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column"
	},
	header: {
		top: 35,
		paddingLeft: 20,
		position: "relative"
	},
	headerTitle: {
		color: "black",
		fontSize: 28,
		fontWeight: "bold"
	}
});

export default RoutineScreen;
