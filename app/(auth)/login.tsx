import { signInWithEmail } from "@/services/auth";
import { isValidEmail } from "@/utils/validation";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
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
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const handleLogin = async () => {
    const nextEmailError = !email.trim()
      ? "Please enter your email."
      : !isValidEmail(email)
        ? "Please enter a valid email address."
        : "";
    const nextPasswordError = !password ? "Please enter your password." : "";
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setServerError("");
    if (nextEmailError || nextPasswordError) return;

    setLoading(true);
    const { error } = await signInWithEmail(email.trim(), password);
    setLoading(false);
    if (error) {
      setServerError(error.message);
      return;
    }

    router.replace("/(tabs)");
  };

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
            placeholderTextColor={"#b5b5b5"}
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (emailError) setEmailError("");
            }}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            style={[
              Loginstyle.input,
              {
                borderColor: emailError
                  ? "#ed4956"
                  : emailFocused
                    ? "blue"
                    : "#b9b9b9",
              },
            ]}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Email address"
          />
          {emailError ? (
            <Text style={Loginstyle.fieldError}>{emailError}</Text>
          ) : null}
          <View
            style={[
              Loginstyle.password,
              {
                borderColor: passwordError
                  ? "#ed4956"
                  : passwordFocused
                    ? "blue"
                    : "#b9b9b9",
              },
            ]}
          >
            <TextInput
              placeholder="password"
              placeholderTextColor={"#b5b5b5"}
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (passwordError) setPasswordError("");
              }}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              style={Loginstyle.passwordinput}
              secureTextEntry={!passwordShown}
              accessibilityLabel="Password"
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
          {passwordError ? (
            <Text style={Loginstyle.fieldError}>{passwordError}</Text>
          ) : null}
          {serverError ? (
            <Text style={Loginstyle.fieldError}>{serverError}</Text>
          ) : null}
          <TouchableOpacity
            style={Loginstyle.loginbtn}
            onPress={handleLogin}
            accessibilityRole="button"
            accessibilityLabel="Log in"
          >
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
              Don&apos;t have an account?
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
    color: "black",
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
    color: "black",
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
  fieldError: {
    color: "#ed4956",
    fontSize: 13,
    marginTop: 4,
    alignSelf: "flex-start",
  },
});
