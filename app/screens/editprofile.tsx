import { router } from "expo-router";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewPost() {
  return (
    <SafeAreaView style={editprofilestyle.container}>
      <View style={editprofilestyle.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={editprofilestyle.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={editprofilestyle.headerTitle}>Edit profile</Text>
        <TouchableOpacity>
          <Text style={editprofilestyle.doneText}>Done</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        style={editprofilestyle.keyboardAvoiding}
        behavior={Platform.OS === "ios" ? "height" : "padding"}
      >
        <ScrollView>
          <View style={editprofilestyle.profileImageContainer}>
            <Image
              style={editprofilestyle.profileImage}
              source={require("../../assets/images/Inner Oval.png")}
            />
            <TouchableOpacity>
              <Text style={editprofilestyle.changePhotoText}>
                Change Profile Photo
              </Text>
            </TouchableOpacity>
          </View>
          <View style={editprofilestyle.divider} />
          <View style={editprofilestyle.row}>
            <Text style={editprofilestyle.label}>Name</Text>
            <TextInput placeholder="name" style={editprofilestyle.input} />
          </View>
          <View style={editprofilestyle.row}>
            <Text style={editprofilestyle.label}>Username</Text>
            <TextInput placeholder="username" style={editprofilestyle.input} />
          </View>
          <View style={editprofilestyle.row}>
            <Text style={editprofilestyle.label}>Website</Text>
            <TextInput placeholder="website" style={editprofilestyle.input} />
          </View>
          <View style={editprofilestyle.row}>
            <Text style={editprofilestyle.label}>Bio</Text>
            <TextInput placeholder="bio" style={editprofilestyle.input} />
          </View>
          <TouchableOpacity>
            <Text style={editprofilestyle.professionalText}>
              Switch to Proffesional Account
            </Text>
          </TouchableOpacity>
          <View style={editprofilestyle.row}>
            <Text style={editprofilestyle.label}>Email</Text>
            <TextInput placeholder="email" style={editprofilestyle.input} />
          </View>
          <View style={editprofilestyle.row}>
            <Text style={editprofilestyle.label}>Phone</Text>
            <TextInput placeholder="phone" style={editprofilestyle.input} />
          </View>
          <View style={editprofilestyle.row}>
            <Text style={editprofilestyle.label}>Gender</Text>
            <TextInput placeholder="gender" style={editprofilestyle.input} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const editprofilestyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 15,
  },
  cancelText: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  doneText: {
    fontSize: 16,
    color: "#3897F0",
  },
  keyboardAvoiding: {
    flex: 1,
  },
  profileImageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    height: 100,
    width: 100,
    resizeMode: "contain",
  },
  changePhotoText: {
    fontSize: 16,
    color: "#3897F0",
    marginVertical: 10,
  },
  divider: {
    height: 1,
    marginTop: 5,
    backgroundColor: "#c0c0c0",
  },
  row: {
    flexDirection: "row",
    padding: 15,
  },
  label: {
    fontSize: 18,
    width: 120,
  },
  input: {
    flex: 1,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  professionalText: {
    fontSize: 16,
    color: "#3897F0",
    marginHorizontal: 20,
  },
});
