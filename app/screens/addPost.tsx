import { supabase } from "@/services/supabase";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Addpost() {
  const [location, setLocation] = useState("");
  const [caption, setCaption] = useState("");
  const [aspect, setAspect] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images", 
      quality: 1,
    });

    
    if (!result.canceled) {
      const asset = result.assets[0];

      setSelectedImage(asset.uri);
      setAspect(asset.width / asset.height);
    }
  };

  const [posting, setPosting] = useState(false);

  const handleProceed = async () => {
    if (!selectedImage) {
      alert("Please select an image first");
      return;
    }
    setPosting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;

      if (!uid) {
        alert("You must be logged in");
        setPosting(false);
        return;
      }

      const response = await fetch(selectedImage);

      const arrayBuffer = await response.arrayBuffer();

      const fileName = `${uid}-${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("posts")
        .upload(fileName, arrayBuffer, { contentType: "image/jpeg" });

      if (uploadError) {
        alert("Failed to upload image: " + uploadError.message);
        setPosting(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("posts")
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from("posts")
        .insert({
          user_id: uid,
          caption,
          location,
          image_url: publicUrlData.publicUrl,
          aspect_ratio: aspect,
        })
        .select();

      if (insertError) {
        alert("Failed to create post: " + insertError.message);
        setPosting(false);
        return;
      }

      router.replace("/(tabs)");
    } catch (error) {
      alert("Something went wrong: " + error);
    } finally {
      setPosting(false);
    }
  };
  if (posting) {
    return (
      <View>
        <ActivityIndicator size={"large"} color={"red"} />
      </View>
    );
  }
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "white" }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: "#b6b6b6",
          justifyContent: "center",
          alignItems: "center",
          width: 300,
          height: selectedImage ? undefined : 380,
          aspectRatio: selectedImage ? aspect : undefined,
          borderRadius: 40,
        }}
        activeOpacity={0.7}
        onPress={pickImage}
      >
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage }}
            style={{
              width: 300,
              height: selectedImage ? undefined : 380,
              aspectRatio: selectedImage ? aspect : undefined,
            }}
            resizeMode="contain"
          />
        ) : (
          <Text>upload a image for post</Text>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="caption"
        style={{
          height: 60,
          width: "90%",
          borderRadius: 20,
          backgroundColor: "#eeeeee",
          padding: 15,
          margin: 20,
        }}
        value={caption}
        multiline
        onChangeText={setCaption}
      />
      <TextInput
        placeholder="Loaction"
        style={{
          height: 60,
          width: "90%",
          borderRadius: 20,
          backgroundColor: "#eeeeee",
          padding: 15,
          marginHorizontal: 20,
          marginBottom: 20,
        }}
        value={location}
        onChangeText={setLocation}
      />
      {posting ? <Text>loading</Text> : <Text>post</Text>}
      <Pressable
        style={{
          height: 50,
          width: 100,
          borderRadius: 25,
          backgroundColor: "blue",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={handleProceed}
      >
        <Text style={{ fontSize: 22, color: "white" }}>Done</Text>
      </Pressable>
    </ScrollView>
  );
}
