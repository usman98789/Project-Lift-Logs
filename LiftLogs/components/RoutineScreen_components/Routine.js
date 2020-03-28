import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	Modal,
	TextInput
} from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";


const Routine = props => {

	
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.button}>
				<Button
					titleStyle={{ fontWeight: "bold" }}
					buttonStyle={{ backgroundColor: "#008000" }}
					title={props.routine_name}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	button: {
		width: "90%",
		alignSelf: "center",
		fontWeight: "bold"
	}
});

export default Routine;
