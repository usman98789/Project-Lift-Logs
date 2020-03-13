import React from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import Ar from "./ar.js";
import Scene from "./scene.js";

const ARScreen = props => {
	return (
		<SafeAreaView style={styles.container}>
			{/* <Ar /> */}
			<Scene />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default ARScreen;
