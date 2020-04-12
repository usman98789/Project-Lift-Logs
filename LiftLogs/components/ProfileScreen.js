import React, { useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	SafeAreaView,
	TouchableOpacity,
	TextInput,
	KeyboardAvoidingView,
	ScrollView
} from "react-native";
import { Button, Overlay } from "react-native-elements";
import { Dropdown } from 'react-native-material-dropdown';
import backendUrl from '../config';
import UserCharts from "./Charts/UserCharts.js";

const ProfileScreen = props => {
	const [showOverlay, setShowOverlay] = useState(false);
	const [usernameInput, setUserNameInput] = useState(null);
	const [passwordInput, setPasswordInput] = useState(null);
	const [signinOrSignup, setSigninOrSignup] = useState(null);
	const [showButtons, setshowButtons] = useState(true);
	const [signOut, setSignOut] = useState(false);

	const { navigation } = props;

	let formatSigninSignUp = text => {
		let newText;

		switch (text) {
			case "signin":
				newText = "Sign In";
				break;
			default:
				newText = "Sign Up";
		}
		return newText;
	};


	let signup = (username, password) => {
		fetch(`${backendUrl}/signup/`, {
			method: "POST",
			body: JSON.stringify({ username: username, password: password }),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			credentials: "include"
		})
			.then(resJson => resJson.json())
			.then(res => {
				setshowButtons(false);
				setSignOut(true);
			})
			.catch(e => console.log(e));
	};

	let signout = () => {
		fetch(`${backendUrl}/signout/`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			credentials: "include"
		})
			.then(res => {
				setshowButtons(true);
				setSignOut(false);
			})
			.catch(e => console.log(e));
	};

	let signin = (username, password) => {
		fetch(`${backendUrl}/signin/`, {
			method: "POST",
			body: JSON.stringify({ username: username, password: password }),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			credentials: "include"
		})
			.then(res => {
				if (!res.ok) {
					let status = res.status;
					throw Error(`Error, status code: ${status}`);
				}
				res.json();
			})
			.then(resJson => {
				console.log('signin res', resJson);
				setshowButtons(false);
				setSignOut(true);
			})
			.catch(e => console.log(e));
	};

	let sendSigninOrSignupReq = (text, username, password) => {
		switch (text) {
			case "signin":
				console.log("signin");
				signin(username, password);
				break;
			default:
				signup(username, password);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={{ flex: 1 }}>
				<ScrollView style={{ height: '100%' }}>
					<View style={styles.header}>
						<Text style={styles.headerTitle}>My Profile</Text>
						{signOut && (
							<View style={{ ...styles.button, top: -15 }}>
								<Button
									titleStyle={{ fontWeight: "bold" }}
									buttonStyle={{ backgroundColor: "#24a0ed" }}
									onPress={() => {
										signout();
									}}
									title="Sign Out"
								/>
							</View>
						)}
					</View>
					{signOut && (
						<UserCharts
							navigation={navigation}
						/>
					)}

					{showButtons && (
						<View>
							<View style={styles.button}>
								<Button // has padding bottom to avoid collision with sign up
									titleStyle={{ fontWeight: "bold" }}
									buttonStyle={{ backgroundColor: "#24a0ed" }}
									onPress={() => {
										setShowOverlay(true);
										setSigninOrSignup("signin");
									}}
									title="Sign In"
								/>
							</View>
							<View style={styles.button}>
								<Button
									titleStyle={{ fontWeight: "bold" }}
									buttonStyle={{ backgroundColor: "#24a0ed" }}
									onPress={() => {
										setShowOverlay(true);
										setSigninOrSignup("signup");
									}}
									title="Sign Up"
								/>
							</View>
						</View>
					)}

					<Overlay isVisible={showOverlay} width="70%" height="35%">
						<View style={{ flex: 1, alignItems: "center", paddingTop: 25 }}>
							<Text
								style={{
									fontFamily: "Baskerville-SemiBoldItalic",
									fontSize: 29,
									paddingBottom: 10
								}}
							>
								Lift Logs
					</Text>
							<KeyboardAvoidingView
								style={{
									borderBottomWidth: 1,
									borderTopWidth: 1,
									borderLeftWidth: 1,
									borderBottomWidth: 1,
									borderRightWidth: 1,
									width: 200
								}}
								behavior="padding"
							>
								<TextInput
									autoCapitalize={"none"}
									style={styles.inputField}
									placeholder="Username"
									placeholderTextColor="#A0A0A0" //placeholderTextColor="#000"
									onChangeText={text => setUserNameInput(text)}
								/>
							</KeyboardAvoidingView>
							<KeyboardAvoidingView
								style={{
									borderBottomWidth: 1,
									borderTopWidth: 1,
									borderLeftWidth: 1,
									borderBottomWidth: 1,
									borderRightWidth: 1,
									width: 200
								}}
								behavior="padding"
							>
								<TextInput
									secureTextEntry={true}
									style={styles.inputField}
									placeholder="Password"
									placeholderTextColor="#A0A0A0"
									onChangeText={text => setPasswordInput(text)}
								/>
							</KeyboardAvoidingView>
							<View
								style={{
									flex: 1,
									flexDirection: "row",
									justifyContent: "center",
									paddingTop: 30
								}}
							>
								<Button
									style={{ paddingRight: 5 }}
									titleStyle={{ fontWeight: "bold" }}
									buttonStyle={{ backgroundColor: "#24a0ed" }}
									onPress={() => {
										sendSigninOrSignupReq(
											signinOrSignup,
											usernameInput,
											passwordInput
										);
										setShowOverlay(false);
									}}
									title={formatSigninSignUp(signinOrSignup)}
								/>
								<Button
									style={{ paddingLeft: 5 }}
									titleStyle={{ fontWeight: "bold" }}
									buttonStyle={{ backgroundColor: "#DC4A3A" }}
									onPress={() => setShowOverlay(false)}
									title="Cancel"
								/>
							</View>
						</View>
					</Overlay>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: '100%'
	},
	header: {
		flex: 1,
		top: 35,
		paddingLeft: 20,
		position: "relative",
		borderBottomColor: "#F0EFF5",
		borderBottomWidth: 2,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	headerTitle: {
		color: "black",
		fontSize: 28,
		fontWeight: "bold"
	},
	button: {
		top: 70,
		width: "40%",
		alignSelf: "center",
		fontWeight: "bold",
		padding: 10
	},
	inputField: {
		padding: 10,
		color: "black",
		fontSize: 21
	}
});

export default ProfileScreen;
