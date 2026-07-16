import { Back, Menu } from "@/Components/navibtns";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
type PicsumImage = {
  id: string;
  author: string;
  download_url: string;
};
export default function UserProfile() {
 const [activeTab, setActiveTab] = useState<"posts" | "mentions">("posts");
 
   const [postImages, setPostImages] = useState<PicsumImage[]>([]);
 
   const [mentionImages, setMentionImages] = useState<PicsumImage[]>([]);
 
   const currentData = activeTab === "posts" ? postImages : mentionImages;
   const fetchimage = async () => {
     try {
      
     } catch {
       console.log("error");
     }
   };
 
   useEffect(() => {
     fetchimage();
   }, []);
   return (
     <SafeAreaView style={profilestyles.safeArea}>
       <View style={profilestyles.flexOne}>
         <FlatList
           ListHeaderComponent={
             <View>
               <View style={profilestyles.topNav}>
                 <Back />
                 <Menu />
               </View>
               <View style={profilestyles.profileSection}>
                 <View style={profilestyles.avatarStatsRow}>
                   <TouchableOpacity style={profilestyles.avatarBorder}>
                     <Image
                       source={require("../../assets/images/Inner Oval.png")}
                       style={profilestyles.avatarImage}
                       resizeMode="contain"
                     />
                   </TouchableOpacity>
                   <View style={profilestyles.statsRow}>
                     <View>
                       <Text>59</Text>
                       <Text>followers</Text>
                     </View>
                     <View>
                       <Text>59</Text>
                       <Text>followers</Text>
                     </View>
                     <View>
                       <Text>59</Text>
                       <Text>followers</Text>
                     </View>
                   </View>
                 </View>
                 <View>
                   <Text>name set by user</Text>
                   <Text>
                     Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                     Neque aliquid velit obcaecati similique dolor.
                   </Text>
                 </View>
                 <TouchableOpacity
                   style={profilestyles.editProfileButton}
                   onPress={() => router.push("/screens/editprofile")}
                 >
                   <Text>Edit Profile</Text>
                 </TouchableOpacity>
               </View>
               <View style={profilestyles.storiesRow}>
                 <View style={profilestyles.storyItem}>
                   <TouchableOpacity style={profilestyles.storyCircle}>
                     <Image
                       source={require("../../assets/images/Add Story.png")}
                       style={profilestyles.addStoryIcon}
                       resizeMode="contain"
                     />
                   </TouchableOpacity>
                   <Text>title</Text>
                 </View>
                 <View style={profilestyles.storyCircle}>
                   <Image
                     source={require("../../assets/images/Inner Oval.png")}
                     resizeMode="cover"
                     style={profilestyles.storyImage}
                   />
                 </View>
                 <View style={profilestyles.storyCircle}>
                   <Image
                     source={require("../../assets/images/Inner Oval.png")}
                     resizeMode="cover"
                     style={profilestyles.storyImage}
                   />
                 </View>
               </View>
               <View style={profilestyles.tabsRow}>
                 <TouchableOpacity
                   style={[
                     profilestyles.tabButton,
                     {
                       borderBottomColor:
                         activeTab === "posts" ? "#000" : "transparent",
                     },
                   ]}
                   onPress={() => setActiveTab("posts")}
                 >
                   <Image
                     source={require("../../assets/images/Grid Icon (1).png")}
                     style={[
                       profilestyles.tabIcon,
                       {
                         tintColor:
                           activeTab === "posts" ? "#000000" : "#888888",
                       },
                     ]}
                   />
                 </TouchableOpacity>
 
                 <TouchableOpacity
                   style={[
                     profilestyles.tabButton,
                     {
                       borderBottomColor:
                         activeTab === "mentions" ? "#000" : "transparent",
                     },
                   ]}
                   onPress={() => setActiveTab("mentions")}
                 >
                   <Image
                     source={require("../../assets/images/Tags Icon (1).png")}
                     style={[
                       profilestyles.tabIcon,
                       {
                         tintColor: activeTab === "mentions" ? "#000" : "#888",
                       },
                     ]}
                   />
                 </TouchableOpacity>
               </View>
             </View>
           }
           data={currentData}
           numColumns={3}
           keyExtractor={(item) => item.id}
           renderItem={({ item }) => (
             <Image
               source={{
                 uri: item.download_url,
               }}
               resizeMode="cover"
               style={profilestyles.gridImage}
             />
           )}
         />
       </View>
     </SafeAreaView>
   );
 }
 
 const profilestyles = StyleSheet.create({
   safeArea: {
     flex: 1,
     backgroundColor: "white",
   },
   flexOne: {
     flex: 1,
   },
   topNav: {
     flexDirection: "row",
     justifyContent: "space-between",
   },
   profileSection: {
     marginHorizontal: 20,
   },
   avatarStatsRow: {
     flexDirection: "row",
     justifyContent: "space-between",
     width: "100%",
   },
   avatarBorder: {
     borderRadius: 50,
     borderColor: "blue",
     borderWidth: 3,
     alignItems: "center",
     justifyContent: "center",
     height: 100,
     width: 100,
   },
   avatarImage: {
     height: 90,
     width: 90,
     borderRadius: 50,
     borderWidth: 2,
     borderColor: "white",
   },
   statsRow: {
     flexDirection: "row",
     marginHorizontal: 20,
     alignSelf: "center",
     gap: 30,
   },
   editProfileButton: {
     width: "100%",
     alignItems: "center",
     justifyContent: "center",
     marginVertical: 20,
     borderWidth: 2,
     borderRadius: 4,
     height: 30,
     borderColor: "#dbdbdb",
   },
   storiesRow: {
     flexDirection: "row",
     width: "100%",
     margin: 10,
     gap: 10,
   },
   storyItem: {
     alignItems: "center",
     justifyContent: "center",
   },
   storyCircle: {
     height: 60,
     width: 60,
     borderColor: "#b5b5b5",
     borderWidth: 2,
     alignItems: "center",
     justifyContent: "center",
     borderRadius: 30,
   },
   addStoryIcon: {
     height: 20,
     width: 20,
     borderWidth: 2,
     borderColor: "white",
   },
   storyImage: {
     height: 55,
     width: 55,
     borderRadius: 27,
     borderWidth: 2,
     borderColor: "white",
   },
   tabsRow: {
     flexDirection: "row",
     borderTopWidth: 1,
     borderTopColor: "#eeeeee",
   },
   tabButton: {
     flex: 1,
     alignItems: "center",
     paddingVertical: 12,
     borderBottomWidth: 2,
   },
   tabIcon: {
     width: 24,
     height: 24,
   },
   gridImage: {
     height: 100,
     width: "33%",
     margin: 1,
   },
 });
 