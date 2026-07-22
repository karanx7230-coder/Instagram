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
import { useUser } from "@/context/UserContext";

export default function AddHighlight() {
  const [aspect, setAspect] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { user } = useUser();

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

  const [Highlight, setHighlight] = useState(false);

  const handleProceed = async () => {
    if (!selectedImage) {
      alert("Please select an image first");
      return;
    }

    try {
      setHighlight(true);

      if (!user) throw new Error("You must be logged in");
      const uid = user.id;

      const response = await fetch(selectedImage);
      if (!response.ok) throw new Error("Failed to read local image file");
      const arrayBuffer = await response.arrayBuffer();

      const fileName = `${uid}-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("Highlight")
        .upload(fileName, arrayBuffer, { contentType: "image/jpeg" });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("Highlight")
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase.from("highlight").insert({
        user_id: uid,
        image_url: publicUrlData.publicUrl,
      });

      if (insertError) throw insertError;
      router.navigate("/(tabs)/profile");
    } catch (error: any) {
      console.log("LOG: HandleProceed workflow error ->", error);
      alert(error.message || "Something went wrong");
    } finally {
      setHighlight(false);
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
          <Text>upload a image for Highlight</Text>
        )}
      </TouchableOpacity>

      {Highlight ? <Text>loading</Text> : <Text>Highlight</Text>}
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
