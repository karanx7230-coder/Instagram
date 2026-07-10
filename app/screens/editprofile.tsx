import { supabase } from "@/services/supabase";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer"; // npm i base64-arraybuffer
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
type inputprops = TextInputProps & {
  placeholder: string;
};
const Input = ({ placeholder, ...props }: inputprops) => {
  return (
    <TextInput
      placeholder={placeholder}
      style={editprofilestyle.input}
      {...props}
    />
  );
};
export default function editPost() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { userId } = useLocalSearchParams<{ userId: string }>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, bio, avatar_url")
          .eq("id", userId)
          .single();

        if (error) throw error;

        setName(data?.full_name ?? "");
        setBio(data?.bio ?? "");
        setAvatarUrl(data?.avatar_url ?? null);
      } catch (error) {
        console.log("fetch profile error:", error);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  const pickAndUploadImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        console.log("permission denied");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (result.canceled || !result.assets?.[0]?.base64) return;

      setUploading(true);
      const fileExt = result.assets[0].uri.split(".").pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, decode(result.assets[0].base64), {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const newAvatarUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: newAvatarUrl })
        .eq("id", userId);

      if (updateError) throw updateError;

      setAvatarUrl(newAvatarUrl);
    } catch (error) {
      console.log("upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleedit = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: name, bio })
        .eq("id", userId);
      if (error) throw error;
      router.navigate("/(tabs)/profile");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView style={editprofilestyle.container}>
      <View style={editprofilestyle.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={editprofilestyle.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={editprofilestyle.headerTitle}>Edit profile</Text>
        <TouchableOpacity onPress={handleedit}>
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
              source={
                avatarUrl
                  ? { uri: avatarUrl }
                  : require("../../assets/images/cry.png")
              }
            />
            <TouchableOpacity onPress={pickAndUploadImage} disabled={uploading}>
              <Text style={editprofilestyle.changePhotoText}>
                {uploading ? "Uploading..." : "Change Profile Photo"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={editprofilestyle.divider} />
          <View style={editprofilestyle.row}>
            <Text style={editprofilestyle.label}>Name</Text>
            <Input placeholder="name" value={name} onChangeText={setName} />
          </View>
          <View style={editprofilestyle.row}>
            <Text style={editprofilestyle.label}>Bio</Text>
            <Input value={bio} onChangeText={setBio} placeholder="bio" />
          </View>
          <TouchableOpacity>
            <Text style={editprofilestyle.professionalText}>
              Switch to Proffesional Account
            </Text>
          </TouchableOpacity>
          <View style={editprofilestyle.row}>
            <Text style={editprofilestyle.label}>Email</Text>
            <Input
              // value={}
              // onChangeText={}
              placeholder="email"
            />
          </View>
          <View style={editprofilestyle.row}>
            <Text style={editprofilestyle.label}>Phone</Text>
            <Input
              // value={}
              // onChangeText={}
              placeholder="phone"
            />
          </View>
          <View style={editprofilestyle.row}>
            <Text style={editprofilestyle.label}>Gender</Text>
            <Input
              // value={}
              // onChangeText={}
              placeholder="gender"
            />
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
    height: 150,
    width: 150,
    borderRadius: 75,
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
