import {
  TouchableOpacity,
  Text,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { router, } from "expo-router";
import { supabase } from "@/services/supabase";

export default function Addstory() {
  const [aspect, setAspect] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    // 1. FIX: Request permission first (Expo requires this)
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // 2. FIX: Use launchImageLibraryAsync instead of just ImagePicker()
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images", // Use modern Expo string syntax
      quality: 1,
    });

    // 3. FIX: Expo returns result.canceled. If not canceled, read assets
    if (!result.canceled && result.assets[0].uri) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      Image.getSize(uri, (width, height) => {
        setAspect(width / height);
      });
    }
  };

  const [Story, setStory] = useState(false);

  const handleProceed = async () => {
    console.log("1. handleProceed called");
    if (!selectedImage) {
      console.log("2. No image selected, aborting");
      alert("Please select an image first");
      return;
    }
    console.log("2. selectedImage:", selectedImage);
    setStory(true);
    try {
      const { data: userData, error: authError } =
        await supabase.auth.getUser();
      console.log("3. userData:", userData, "authError:", authError);
      const uid = userData.user?.id;

      if (!uid) {
        console.log("4. No uid found — user not logged in");
        alert("You must be logged in");
        setStory(false);
        return;
      }
      console.log("4. uid:", uid);

      console.log("5. Fetching local image...");
      const response = await fetch(selectedImage);
      console.log("6. fetch response ok:", response.ok, response.status);

      const arrayBuffer = await response.arrayBuffer();
      console.log("7. arrayBuffer byteLength:", arrayBuffer.byteLength);

      const fileName = `${uid}-${Date.now()}.jpg`;
      console.log("8. Uploading as:", fileName);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("story")
        .upload(fileName, arrayBuffer, { contentType: "image/jpeg" });

      console.log("9. uploadData:", uploadData, "uploadError:", uploadError);

      if (uploadError) {
        console.log("10. Upload failed:", uploadError);
        alert("Failed to upload image: " + uploadError.message);
        setStory(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("story")
        .getPublicUrl(fileName);
      console.log("11. publicUrlData:", publicUrlData);

      const { data: insertData, error: insertError } = await supabase
        .from("story")
        .insert({
          user_id: uid,
          image_url: publicUrlData.publicUrl,
        })
        .select();

      console.log("12. insertData:", insertData, "insertError:", insertError);

      if (insertError) {
        console.log("13. Insert failed:", insertError);
        alert("Failed to create story: " + insertError.message);
        setStory(false);
        return;
      }

      console.log("14. Success! Navigating home");
      router.navigate("/(tabs)");
    } catch (error) {
      console.log("15. CAUGHT ERROR:", error);
      alert("Something went wrong: " + error);
    } finally {
      setStory(false);
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

      {Story ? <Text>loading</Text> : <Text>story</Text>}
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
