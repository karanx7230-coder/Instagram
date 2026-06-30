import { Back, Menu } from "@/Components/navibtns";
import { APIpic } from "@/services/api";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
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
      const response = await APIpic.get(`/v2/list?page=2&limit=8`);

      setPostImages(response.data);

      setMentionImages(response.data);
    } catch {
      console.log("error");
    }
  };

  useEffect(() => {
    fetchimage();
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Back />
                <Menu />
              </View>
              <View style={{ marginHorizontal: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      borderRadius: 50,
                      borderColor: "blue",
                      borderWidth: 3,
                      alignItems: "center",
                      justifyContent: "center",
                      height: 100,
                      width: 100,
                    }}
                  >
                    <Image
                      source={require("../../assets/images/Inner Oval.png")}
                      style={{
                        height: 90,
                        width: 90,
                        borderRadius: 50,
                        borderWidth: 2,
                        borderColor: "white",
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: "row",
                      marginHorizontal: 20,
                      alignSelf: "center",
                      gap: 30,
                    }}
                  >
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
                  style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: 20,
                    borderWidth: 2,
                    borderRadius: 4,
                    height: 30,
                    borderColor: "#dbdbdb",
                  }}
                >
                  <Text>Edit Profile</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  margin: 10,
                  gap: 10,
                }}
              >
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <TouchableOpacity
                    style={{
                      height: 60,
                      width: 60,
                      borderColor: "#b5b5b5",
                      borderWidth: 2,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 30,
                    }}
                  >
                    <Image
                      source={require("../../assets/images/Add Story.png")}
                      style={{
                        height: 20,
                        width: 20,
                        borderWidth: 2,
                        borderColor: "white",
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <Text>title</Text>
                </View>
                <View
                  style={{
                    height: 60,
                    width: 60,
                    borderColor: "#b5b5b5",
                    borderWidth: 2,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 30,
                  }}
                >
                  <Image
                    source={require("../../assets/images/Inner Oval.png")}
                    resizeMode="cover"
                    style={{
                      height: 55,
                      width: 55,
                      borderRadius: 27,
                      borderWidth: 2,
                      borderColor: "white",
                    }}
                  />
                </View>
                <View
                  style={{
                    height: 60,
                    width: 60,
                    borderColor: "#b5b5b5",
                    borderWidth: 2,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 30,
                  }}
                >
                  <Image
                    source={require("../../assets/images/Inner Oval.png")}
                    resizeMode="cover"
                    style={{
                      height: 55,
                      width: 55,
                      borderRadius: 27,
                      borderWidth: 2,
                      borderColor: "white",
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  borderTopWidth: 1,
                  borderTopColor: "#eeeeee",
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: "center",
                    paddingVertical: 12,
                    borderBottomWidth: 2,
                    borderBottomColor:
                      activeTab === "posts" ? "#000" : "transparent",
                  }}
                  onPress={() => setActiveTab("posts")}
                >
                  <Image
                    source={require("../../assets/images/Grid Icon (1).png")}
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: activeTab === "posts" ? "#000000" : "#888888",
                    }}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: "center",
                    paddingVertical: 12,
                    borderBottomWidth: 2,
                    borderBottomColor:
                      activeTab === "mentions" ? "#000" : "transparent",
                  }}
                  onPress={() => setActiveTab("mentions")}
                >
                  <Image
                    source={require("../../assets/images/Tags Icon (1).png")}
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: activeTab === "mentions" ? "#000" : "#888",
                    }}
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
              style={{ height: 100, width: "33%", margin: 1 }}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}
