import { signUpWithEmail } from "@/services/auth";
import { createProfile, isUsernameTaken } from "@/services/users";
import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
} from "@/utils/validation";
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

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  async function handleSignUp() {
    const nextUsernameError = !username.trim()
      ? "Please choose a username."
      : !isValidUsername(username)
        ? "Usernames need 3-30 letters, numbers, dots or underscores."
        : "";
    const nextEmailError = !email.trim()
      ? "Please enter your email."
      : !isValidEmail(email)
        ? "Please enter a valid email address."
        : "";
    const nextPasswordError = !isValidPassword(password)
      ? "Password must be at least 6 characters."
      : "";
    setUsernameError(nextUsernameError);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setServerError("");
    if (nextUsernameError || nextEmailError || nextPasswordError) return;

    setLoading(true);
    try {
      if (await isUsernameTaken(username.trim())) {
        setUsernameError("Username taken. Try another username.");
        return;
      }

      const { data, error } = await signUpWithEmail(email.trim(), password);
      if (error) {
        setServerError(error.message);
        return;
      }

      if (data.user) {
        const { error: profileError } = await createProfile(
          data.user.id,
          username.trim(),
        );

        if (profileError) {
          setServerError(profileError.message);
          return;
        }
      }

      router.replace("/(tabs)");
    } finally {
      setLoading(false);
    }
  }
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={"blue"} size={"large"} />
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
            placeholder="username"
            placeholderTextColor={"#b5b5b5"}
            value={username}
            onChangeText={(value) => {
              setUsername(value);
              if (usernameError) setUsernameError("");
            }}
            onFocus={() => setUsernameFocused(true)}
            onBlur={() => setUsernameFocused(false)}
            style={[
              Loginstyle.input,
              {
                borderColor: usernameError
                  ? "#ed4956"
                  : usernameFocused
                    ? "blue"
                    : "#b9b9b9",
              },
            ]}
            autoCapitalize="none"
            accessibilityLabel="Username"
          />
          {usernameError ? (
            <Text style={Loginstyle.fieldError}>{usernameError}</Text>
          ) : null}
          <TextInput
            placeholderTextColor={"#b5b5b5"}
            placeholder="email"
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
              placeholderTextColor={"#b5b5b5"}
              placeholder="password"
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
            onPress={handleSignUp}
            accessibilityRole="button"
            accessibilityLabel="Create account"
          >
            <Text style={Loginstyle.logintext}>Create Account</Text>
          </TouchableOpacity>
          <View style={Loginstyle.row}>
            <View style={Loginstyle.line} />
            <Text style={Loginstyle.or}>OR</Text>
            <View style={Loginstyle.line} />
          </View>
          <Pressable
            onPress={() => router.navigate("/(auth)/login")}
            style={Loginstyle.signup}
          >
            <Text style={Loginstyle.text1}>
              Don&apos;t have an account?
              <Text style={Loginstyle.text2}>Sign in</Text>
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
    color: "black",
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
  fieldError: {
    color: "#ed4956",
    fontSize: 13,
    marginTop: 4,
    alignSelf: "flex-start",
  },
});
