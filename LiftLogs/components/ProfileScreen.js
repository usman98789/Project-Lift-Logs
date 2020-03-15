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
        "Accept": "application/json",
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
      </View>

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
      <Overlay isVisible={showOverlay} width="70%" height="30%">
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
          <View
            style={{
              borderBottomWidth: 1,
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderBottomWidth: 1,
              borderRightWidth: 1,
              width: 200
            }}
          >
            <TextInput
              autoCapitalize={'none'}
              style={styles.inputField}
              placeholder="Username"
              placeholderTextColor="#A0A0A0" //placeholderTextColor="#000"
              onChangeText={text => setUserNameInput(text)}
            />
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderBottomWidth: 1,
              borderRightWidth: 1,
              width: 200
            }}
          >
            <TextInput
              secureTextEntry={true}
              style={styles.inputField}
              placeholder="Password"
              placeholderTextColor="#A0A0A0"
              onChangeText={text => setPasswordInput(text)}
            />
          </View>
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
              buttonStyle={{ backgroundColor: "#DC4A3A" }}
              onPress={() => setShowOverlay(false)}
              title="Cancel"
            />
          </View>
        </View>
      </Overlay>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    top: 35,
    paddingLeft: 20,
    position: "relative",
    borderBottomColor: "#F0EFF5",
    borderBottomWidth: 2,
    paddingBottom: 20
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
    color: "black",
    fontSize: 21
  }
});

export default ProfileScreen;
