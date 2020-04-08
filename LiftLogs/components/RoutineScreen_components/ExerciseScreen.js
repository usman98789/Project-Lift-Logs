import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	SafeAreaView,
	TouchableOpacity
} from "react-native";


const ExerciseScreen = props => {


	return (
        <SafeAreaView style={styles.container}>
            <View>
                <TouchableOpacity activeOpacity={0.5} style={{ zIndex: 1 }}>
                    <View style={styles.exercise}>
                        <Text style={{ fontSize: 19 }}>{props.exercise_name}</Text>
                        <Text style={{ fontSize: 14 }}>{props.reps} </Text>
                        <Text style={{ fontSize: 14 }}>{props.sets} </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
    
};

const styles = StyleSheet.create({
	headerTitle: {
		color: "black",
		fontSize: 28,
		fontWeight: "bold"
	},
	exercise: {
		marginTop: 15,
		right: -20,
		flexDirection: "row",
		width: "90%",
		height: 100,
		borderRadius: 5,
		padding: 15,
		backgroundColor: "white"
	}
});

export default ExerciseScreen;