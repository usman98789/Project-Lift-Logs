import React, { useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	SafeAreaView,
	TouchableOpacity,
	TextInput
} from "react-native";
import { Button, Overlay } from "react-native-elements";

const ProfileScreen = props => {
	const [showOverlay, setShowOverlay] = useState(false);
	const [usernameInput, setUserNameInput] = useState(null);
	const [passwordInput, setPasswordInput] = useState(null);
	const [signinOrSignup, setSigninOrSignup] = useState(null);

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

	// for using your physical phone, add your ip address
	let localIPAddress = "";

	let signup = (username, password) => {
		fetch(`http://${localIPAddress}:3000/signup/`, {
			method: "POST",
			body: JSON.stringify({ username: username, password: password }),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			credentials: "include"
		})
			.then(resJson => resJson.json())
			.then(res => console.log(res))
			.catch(e => console.log(e));
	};

	let signin = (username, password) => {
		fetch(`http://${localIPAddress}:3000/signin/`, {
			method: "POST",
			body: JSON.stringify({ username: username, password: password }),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			credentials: "include"
		})
			.then(resJson => resJson.json())
			.then(res => console.log(res))
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
			<View style={styles.header}>
				<Text style={styles.headerTitle}>My Profile</Text>
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
				<Overlay isVisible={showOverlay}>
					<View style={{ flex: 1, alignItems: "center" }}>
						<TextInput
							style={styles.inputField}
							placeholder="username"
							placeholderTextColor="#A0A0A0" //placeholderTextColor="#000"
							onChangeText={text => setUserNameInput(text)}
						/>
						<TextInput
							style={styles.inputField}
							placeholder="password"
							placeholderTextColor="#A0A0A0"
							onChangeText={text => setPasswordInput(text)}
						/>

						<View
							style={{
								flex: 1,
								flexDirection: "row",
								justifyContent: "center",
								paddingTop: 5
							}}
						>
							<Button
								style={{ paddingRight: 5 }}
								titleStyle={{ fontWeight: "bold" }}
								buttonStyle={{ backgroundColor: "#24a0ed" }}
								onPress={() => {
									console.log(usernameInput);
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
								buttonStyle={{ backgroundColor: "#24a0ed" }}
								onPress={() => setShowOverlay(false)}
								title="Cancel"
							/>
						</View>
					</View>
				</Overlay>
				{/* <View style={styles.button}>
          <Button 
            titleStyle={{ fontWeight: "bold" }}
            buttonStyle={{ backgroundColor: "#24a0ed" }}
            onPress={() => {
              setShowOverlay(true);
              setSigninOrSignup("signin")
            }}
            title="Sign In"
          />  */}
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
	},
	button: {
		top: 70,
		width: "90%",
		alignSelf: "center",
		fontWeight: "bold",
		padding: 10
	},
	inputField: {
		padding: 10,
		color: "black"
	}
});

export default ProfileScreen;
