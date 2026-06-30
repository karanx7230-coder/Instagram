import { router } from "expo-router";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewPost() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 15,
        }}
      >
        <TouchableOpacity onPress={()=>router.back()} >
          <Text style={{ fontSize: 16 }}>Cancel</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Edit profile</Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 16, color: "#3897F0" }}>Done</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "height" : "padding"}
      >
        <ScrollView>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image source={require("../../assets/images/background.png")} />
            <TouchableOpacity>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  color: "#3897F0",
                  marginVertical: 10,
                }}
              >
                Change Profile Photo
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 1,
              marginTop: 5,
              backgroundColor: "#c0c0c0",
              width: "100%",
            }}
          />
          <View style={{ flexDirection: "row", padding: 15 }}>
            <Text
              style={{
                fontSize: 18,
                width: 120,
              }}
            >
              Name
            </Text>
            <TextInput
              placeholder="name"
              style={{
                flex: 1,
                borderBottomColor: "black",
                borderBottomWidth: 1,
              }}
            />
          </View>
          <View style={{ flexDirection: "row", padding: 15 }}>
            <Text
              style={{
                fontSize: 18,
                width: 120,
              }}
            >
              Username
            </Text>
            <TextInput
              placeholder="username"
              style={{
                flex: 1,
                borderBottomColor: "black",
                borderBottomWidth: 1,
              }}
            />
          </View>
          <View style={{ flexDirection: "row", padding: 15 }}>
            <Text
              style={{
                fontSize: 18,
                width: 120,
              }}
            >
              Website
            </Text>
            <TextInput
              placeholder="website"
              style={{
                flex: 1,
                borderBottomColor: "black",
                borderBottomWidth: 1,
              }}
            />
          </View>
          <View style={{ flexDirection: "row", padding: 15 }}>
            <Text
              style={{
                fontSize: 18,
                width: 120,
              }}
            >
              Bio
            </Text>
            <TextInput
              placeholder="bio"
              style={{
                flex: 1,
                borderBottomColor: "black",
                borderBottomWidth: 1,
              }}
            />
          </View>
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 16,
                color: "#3897F0",
                marginHorizontal: 20,
              }}
            >
              Switch to Proffesional Account
            </Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", padding: 15 }}>
            <Text
              style={{
                fontSize: 18,
                width: 120,
              }}
            >
              Email
            </Text>
            <TextInput
              placeholder="email"
              style={{
                flex: 1,
                borderBottomColor: "black",
                borderBottomWidth: 1,
              }}
            />
          </View>
          <View style={{ flexDirection: "row", padding: 15 }}>
            <Text
              style={{
                fontSize: 18,
                width: 120,
              }}
            >
              Phone
            </Text>
            <TextInput
              placeholder="phone"
              style={{
                flex: 1,
                borderBottomColor: "black",
                borderBottomWidth: 1,
              }}
            />
          </View>
          <View style={{ flexDirection: "row", padding: 15 }}>
            <Text
              style={{
                fontSize: 18,
                width: 120,
              }}
            >
              Gender
            </Text>
            <TextInput
              placeholder="gender"
              style={{
                flex: 1,
                borderBottomColor: "black",
                borderBottomWidth: 1,
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
