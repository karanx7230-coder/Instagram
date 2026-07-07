import { supabase } from "@/services/supabase";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  const [loading, setLoading] = useState(false);
  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Missing fields", "Please enter email and password.");
      return;
    }

    console.log("=== LOGIN ATTEMPT ===");
    console.log("EMAIL VALUE:", JSON.stringify(email));
    console.log("PASSWORD VALUE:", JSON.stringify(password));

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    console.log("LOGIN DATA:", JSON.stringify(data));
    console.log("LOGIN ERROR:", JSON.stringify(error));

    if (error) {
      Alert.alert("Login failed", error.message);
      return;
    }

    console.log("LOGIN SUCCESS - USER:", JSON.stringify(data.user));
    console.log("LOGIN SUCCESS - SESSION:", JSON.stringify(data.session));

    router.replace("/(tabs)");
  }
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color={"blue"} />
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      style={Loginstyle.keyboard}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={Loginstyle.scrollview}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={Loginstyle.container}>
          <Image
            source={require("../../assets/images/Instagram Logo.png")}
            resizeMode="contain"
            style={Loginstyle.logo}
          />
          <TextInput
            placeholder="EMAIL"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            style={[
              Loginstyle.input,
              {
                borderColor: emailFocused ? "blue" : "#b9b9b9",
              },
            ]}
          />
          <View
            style={[
              Loginstyle.password,
              {
                borderColor: passwordFocused ? "blue" : "#b9b9b9",
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
            <TouchableOpacity
              style={Loginstyle.inputimgbtn}
              onPress={() => setPasswordShown(!passwordShown)}
            >
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
            <Text style={Loginstyle.forget}>Forget password?</Text>
          </Pressable>
          <TouchableOpacity style={Loginstyle.loginbtn} onPress={handleLogin}>
            <Text style={Loginstyle.logintext}>Log in</Text>
          </TouchableOpacity>
          <View style={Loginstyle.row}>
            <View style={Loginstyle.line} />
            <Text style={Loginstyle.or}>OR</Text>
            <View style={Loginstyle.line} />
          </View>
          <Pressable
            onPress={() => router.navigate("/(auth)/signup")}
            style={Loginstyle.signup}
          >
            <Text style={Loginstyle.text1}>
              Don't have an account?
              <Text style={Loginstyle.text2}>Sign up</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const Loginstyle = StyleSheet.create({
  password: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    height: 50,
    borderWidth: 1,
    alignSelf: "center",
    width: "100%",
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  passwordinput: {
    flex: 1,
    paddingHorizontal: 15,
    height: "100%",
  },

  inputimgbtn: {
    width: 30,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  inputimg: {
    height: 20,
    width: 20,
  },
  keyboard: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollview: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    height: 50,
    marginVertical: 10,
    alignSelf: "center",
    padding: 15,
    borderWidth: 1,
    width: "100%",
  },

  logo: {
    marginBottom: 50,
    width: "100%",
    alignSelf: "center",
  },

  forget: {
    color: "#3797EF",
    alignSelf: "flex-end",
    marginTop: 5,
  },
  loginbtn: {
    width: "100%",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#3797EF",
    borderRadius: 8,
    marginVertical: 30,
  },
  logintext: {
    fontSize: 18,
    color: "#ffffff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    backgroundColor: "#d9d9d9",
    height: 1,
    flex: 1,
  },
  or: {
    fontSize: 15,
    marginHorizontal: 15,
    color: "#727272",
  },
  signup: {
    marginTop: 40,
    alignItems: "center",
  },
  text1: {
    fontSize: 15,
    color: "#727272",
  },
  text2: {
    fontSize: 15,
    color: "#3797EF",
  },
});
