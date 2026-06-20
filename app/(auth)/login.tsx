import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  return (
    <KeyboardAvoidingView
      style={Loginstyle.keyboard}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={Loginstyle.scrollview}
        keyboardShouldPersistTaps="handled"
      >
        <View style={Loginstyle.container}>
          <Image
            source={require("../../assets/images/Instagram Logo.png")}
            resizeMode="contain"
            style={Loginstyle.logo}
          />
          <TextInput
            placeholder="username"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            style={[
              Loginstyle.input,
              {
                borderColor: emailFocused ? "black" : "#b9b9b9",
              },
            ]}
          />
          <View
            style={[
              Loginstyle.password,
              {
                borderColor: passwordFocused ? "black" : "#b9b9b9",
              },
            ]}
          >
            <TextInput
              placeholder="password"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              style={Loginstyle.passwordinput}
              secureTextEntry={!passwordShown}
            />
            <TouchableOpacity onPress={() => setPasswordShown(!passwordShown)}>
              <Image
                source={
                  passwordShown
                    ? require("../../assets/images/unlock.png")
                    : require("../../assets/images/lock.png")
                }
                resizeMode="contain"
                style={Loginstyle.inputimg}
              />
            </TouchableOpacity>
          </View>
          <Pressable>
            <Text style={{ color: "#3797EF", alignSelf: "flex-end"  }}>Forget password?</Text>
          </Pressable>
          <TouchableOpacity
            style={{
              width: "100%",
              alignItems: "center",
              padding: 15,
              backgroundColor: "#3797EF",
              borderRadius: 8,
              marginVertical: 30,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: "#ffffff",
              }}
            >
              Log in
            </Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <View
              style={{
                backgroundColor: "#d9d9d9",
                height: 2,
                flex: 1,
                width: "100%",
                alignSelf: "center",
              }}
            />
            <Text
              style={{
                fontSize: 15,
                marginHorizontal: 15,
                alignSelf: "center",
                color: "#727272",
              }}
            >
              OR
            </Text>
            <View
              style={{
                backgroundColor: "#d9d9d9",
                height: 2,
                flex: 1,
                width: "100%",
                alignSelf: "center",
              }}
            />
          </View>
          <Pressable style={{ top: "5%", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 15,
                color: "#727272",
              }}
            >
              Dont't have an account?
              <Text
                style={{
                  fontSize: 15,
                  color: "#3797EF",
                }}
              >
                Sign up
              </Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const Loginstyle = StyleSheet.create({
  keyboard: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  scrollview: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  input: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    height: 50,
    margin: 10,
    alignSelf: "center",
    padding: 15,
    borderWidth: 1,
    width: "100%",
  },
  password: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    height: 50,
    borderWidth: 1,
    alignSelf: "center",
    width: "100%",
    margin: 10,
    flexDirection: "row",
  },
  passwordinput: {
    padding: 15,
    width: "90%",
  },
  container: {
    flex: 2,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    marginBottom: 50,
    width: "100%",
    alignSelf: "center",
  },
  inputimg: {
    height: 20,
    width: 20,
    alignSelf: "center",
    marginBlock: 15,
  },
});
