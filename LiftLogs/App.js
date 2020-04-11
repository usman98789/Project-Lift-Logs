import React, { useState } from "react";
import { StyleSheet } from "react-native";

import { createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import ProfileScreen from "./components/ProfileScreen";
import LogScreen from "./components/LogScreen";
import RoutineScreen from "./components/RoutineScreen";
import ARScreen from "./components/ARScreen";

const AppTabNavigator = createMaterialBottomTabNavigator(
	{
		Profile: {
			screen: ProfileScreen,
			navigationOptions: {
				tabBarLabel: "Profile",
				tabBarIcon: ({ tintColor }) => (
					<Icon name="ios-person" color={tintColor} size={24} />
				),
				animationEnabled: false,
				activeColor: "#ffffff",
				inactiveColor: "#DCDCDC",
				barStyle: { backgroundColor: "#2163f6" }
			}
		},
		Log: {
			screen: LogScreen,
			navigationOptions: {
				tabBarLabel: "Workout Logs",
				tabBarIcon: ({ tintColor }) => (
					<Icon name="ios-book" color={tintColor} size={24} />
				),
				animationEnabled: false,
				activeColor: "#ffffff",
				inactiveColor: "#DCDCDC",
				barStyle: { backgroundColor: "#2163f6" }
			}
		},
		Routines: {
			screen: RoutineScreen,
			navigationOptions: {
				tabBarLabel: "Start Workout",
				tabBarIcon: ({ tintColor }) => (
					<Icon name="ios-home" color={tintColor} size={24} />
				),
				animationEnabled: false,
				activeColor: "#ffffff",
				inactiveColor: "#DCDCDC",
				barStyle: { backgroundColor: "#2163f6" }
			}
		},
		AR: {
			screen: ARScreen,
			navigationOptions: {
				tabBarLabel: "Tutorials",
				tabBarIcon: ({ tintColor }) => (
					<Icon name="ios-star" color={tintColor} size={24} />
				),
				animationEnabled: false,
				activeColor: "#ffffff",
				inactiveColor: "#DCDCDC",
				barStyle: { backgroundColor: "#2163f6" }
			}
		}
	},
	{
		initialRouteName: "Routines",
		order: ["Routines", "Log", "AR", "Profile"]
	}
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff"
	}
});

export default createAppContainer(AppTabNavigator);
