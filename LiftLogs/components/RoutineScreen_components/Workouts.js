/** 
import {React, useState ,useEffect} from "react";
import { View, StyleSheet, Text, SafeAreaView, Button } from "react-native";

const Workouts = props => {

	const [routineList, setroutineList] = useState([]);
	function RList(props) {
		const routines = props.routines;
		const listItems = routines.map((routine) =>
		  <li>{routine}</li>
		);
		return (
		  <ul>{listItems}</ul>
		);
	  }
	  


	useEffect(() => {
		setroutineList([{_id: "1", routine_name: "big man on campus", routine_user: "jack"}, 
		{_id: "1", routine_name: "big man on campus", routine_user: "jack"}]);
	}, [])

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

*/