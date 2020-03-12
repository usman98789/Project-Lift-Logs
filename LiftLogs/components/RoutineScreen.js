import React, { useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	Modal
} from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";

const RoutineScreen = props => {
	const [emptyOpen, setemptyOpen] = useState(false);
	const [date, setDate] = useState(new Date());
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Start Workout</Text>
			</View>
			<View style={styles.button}>
				<Button
					titleStyle={{ fontWeight: "bold" }}
					buttonStyle={{ backgroundColor: "#24a0ed" }}
					onPress={() => setemptyOpen(true)}
					title="Start an Empty Workout"
				/>
			</View>
			<Modal visible={emptyOpen} animationType="slide">
				<SafeAreaView>
					{/* Extract out later as workout component */}
					<View
						style={{
							borderBottomColor: "#F0EFF5",
							borderBottomWidth: 2
						}}
					>
						<TouchableOpacity
							activeOpacity={0.5}
							onPress={() => setemptyOpen(false)}
							style={styles.TouchableOpacity}
						>
							<Icon name="ios-close" size={55} style={{ color: "#DC4A3A" }} />
							<Button
								buttonStyle={{ backgroundColor: "#2dcc70" }}
								style={styles.saveButton}
								title="Save"
							/>
						</TouchableOpacity>
						<Text style={styles.workoutTitle}>
							{date.toDateString()}'s Workout
						</Text>
					</View>
					<ScrollView>
						<Button
							buttonStyle={{ backgroundColor: "#24a0ed" }}
							style={styles.exButton}
							title="Add an Excercise"
							titleStyle={{ fontWeight: "bold" }}
						/>
					</ScrollView>
				</SafeAreaView>
			</Modal>
			<View style={styles.routines}>
				<View style={styles.routineHeader}>
					<Text style={styles.routineTitle}>Routines & Plans</Text>
					<TouchableOpacity activeOpacity={0.5} style={styles.TouchableOpacity}>
						<Icon name="ios-add" size={40} style={styles.icon} />
					</TouchableOpacity>
				</View>
				<ScrollView style={styles.test}></ScrollView>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	header: {
		top: 35,
		paddingLeft: 20
	},
	button: {
		top: 70,
		width: "90%",
		alignSelf: "center",
		fontWeight: "bold"
	},
	headerTitle: {
		color: "black",
		fontSize: 28,
		fontWeight: "bold"
	},
	routines: {
		top: 90,
		paddingLeft: 20
	},
	routineTitle: {
		paddingTop: 15,
		color: "black",
		fontSize: 20,
		fontWeight: "bold"
	},
	routineHeader: {
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
		justifyContent: "space-between",
		borderBottomColor: "#F0EFF5",
		borderBottomWidth: 2
	},
	icon: {
		paddingRight: 30
	},
	TouchableOpacity: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		alignItems: "center",
		zIndex: 1,
		paddingTop: 15,
		left: 15
	},
	workoutTitle: {
		color: "black",
		fontSize: 24,
		fontWeight: "600",
		paddingBottom: 5,
		textAlign: "center",
		paddingTop: 15
	},
	saveButton: {
		paddingRight: 27,
		height: 50
	},
	exButton: {
		paddingTop: 60,
		width: "90%",
		alignSelf: "center"
	}
});

export default RoutineScreen;
