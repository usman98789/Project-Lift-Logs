import React from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";

const ARScreen = props => {
	return (
		<SafeAreaView style={styles.container}>
			<Text>AR Screen</Text>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default ARScreen;
