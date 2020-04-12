import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, SafeAreaView, Picker } from "react-native";
import Ar from "./ar.js";
import { Button } from "react-native-elements";

const ARScreen = props => {
	const data = ["Stretch", "Walk"];
	const [chosen, setChosen] = useState(data[0]);
	console.log(chosen);
	return (
		<SafeAreaView style={styles.container}>
			<View style={{ height: "20%", alignSelf: "center" }}>
				<Picker
					selectedValue={chosen}
					style={{ height: 50, width: 150 }}
					onValueChange={(itemValue, itemIndex) => {
						setChosen(itemValue);
						return (
							<View style={{ height: "80%" }}>
								<Ar chosen={chosen} />
							</View>
						);
					}}
				>
					<Picker.Item label="Stretch" value="Stretch" />
					<Picker.Item label="Walk" value="Walk" />
				</Picker>
			</View>
			<View style={{ height: "80%" }}>
				<Ar chosen={chosen} />
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
export default ARScreen;
