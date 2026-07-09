import { View, TouchableOpacity, Text } from "react-native";

export default function Addpost() {
  return (
    <View style={{ flex: 1, alignItems: "center" ,backgroundColor:"white"}}>
      <TouchableOpacity
        style={{
          backgroundColor: "red",
          height: 200,
          width: 200,
          borderRadius: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>hello</Text>
      </TouchableOpacity>
      <View
        style={{
          height: 70,
          width: "100%",
          borderRadius: 20,
          backgroundColor: "blue",
          margin:20,
        }}
      />
      <View
        style={{
          height: 70,
          width: "100%",
          borderRadius: 20,
          backgroundColor: "blue",
          margin: 20,
        }}
      />
    </View>
  );
}
// const [selectedImage, setSelectedImage] = useState<string | null>(null);

//   const pickImage = async () => {
//     // 1. FIX: Request permission first (Expo requires this)
//     const permissionResult =
//       await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (permissionResult.granted === false) {
//       alert("Permission to access camera roll is required!");
//       return;
//     }

//     // 2. FIX: Use launchImageLibraryAsync instead of just ImagePicker()
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: "images", // Use modern Expo string syntax
//       allowsEditing: true, // Optional: allows user to crop it like Instagram!
//       quality: 1,
//     });

//     // 3. FIX: Expo returns result.canceled. If not canceled, read assets
//     if (!result.canceled && result.assets && result.assets[0].uri) {
//       setSelectedImage(result.assets[0].uri);
//     }
//   };

//   const handleProceed = () => {
//     alert("Proceeding with the selected image!");
//   };
