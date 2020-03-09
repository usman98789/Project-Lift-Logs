import React from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";

const ProfileScreen = props => {
	return (
		<SafeAreaView>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>My Profile</Text>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
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

export default ProfileScreen;
