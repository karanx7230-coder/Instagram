import { supabase } from "@/services/supabase";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";

export default function Addstory() {
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

    if (!result.canceled && result.assets[0].uri) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      Image.getSize(uri, (width, height) => {
        setAspect(width / height);
      });
    }
  };

  const [story, setstory] = useState(false);

  const handleProceed = async () => {
    if (!selectedImage) {
      alert("Please select an image first");
      return;
    }
    setstory(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;

      if (!uid) {
        alert("You must be logged in");
        setstory(false);
        return;
      }

      const response = await fetch(selectedImage);

      const arrayBuffer = await response.arrayBuffer();

      const fileName = `${uid}-${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("story")
        .upload(fileName, arrayBuffer, { contentType: "image/jpeg" });

      if (uploadError) {
        alert("Failed to upload image: " + uploadError.message);
        setstory(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("story")
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from("story")
        .insert({
          user_id: uid,
          image_url: publicUrlData.publicUrl,
        })
        .select();

      if (insertError) {
        alert("Failed to create story: " + insertError.message);
        setstory(false);
        return;
      }

      console.log("Success!");
      router.navigate("/(tabs)");
    } catch (error) {
      alert("Something went wrong: " + error);
    } finally {
      setstory(false);
    }
  };
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
          <Text>upload a image for story</Text>
        )}
      </TouchableOpacity>

      {story ? <Text>loading</Text> : <Text>story</Text>}
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
