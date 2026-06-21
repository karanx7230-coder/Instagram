import {
  FlatList,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type StoryItem = {
  id: string;
  username: string;
};

type PostItem = {
  id: string;
  username: string;
  location: string;
  profileImg: ImageSourcePropType;
  postImg: ImageSourcePropType;
  likes: number;
  caption: string;
};

export default function Index() {
  // const [users, setUsers] = useState<any[]>([]);

  // const fetchUsers = async () => {
  //   try {
  //     const { data } = await API.get("/users");
  //     setUsers(data.users);
  //   } catch {
  //     Alert.alert("Failed");
  //   }
  // };
  // useEffect(() => {
  //   console.log(users);
  // }, [users]);
  // useEffect(() => {
  //   fetchUsers();
  // }, []);
  const mockStories = [
    { id: "1", username: "john_doe" },
    { id: "2", username: "jane_smith" },
    { id: "3", username: "cool_dev" },
    { id: "4", username: "react_native_fan" },
    { id: "5", username: "ui_designer" },
    { id: "6", username: "travel_blogger" },
    { id: "7", username: "john_doe" },
    { id: "8", username: "jane_smith" },
    { id: "9", username: "cool_dev" },
    { id: "10", username: "react_native_fan" },
    { id: "11", username: "ui_designer" },
    { id: "12", username: "travel_blogger" },
  ];
  const posts = [
    {
      id: "1",
      username: "joshua_l",
      location: "Tokyo, Japan",
      profileImg: require("../../assets/images/Inner Oval.png"),
      postImg: require("../../assets/images/instagram.png"),
      likes: 44686,
      caption: "The game in Japan was amazing and I want to share some photos.",
    },
    {
      id: "2",
      username: "karennne",
      location: "Seoul, South Korea",
      profileImg: require("../../assets/images/Inner Oval.png"),
      postImg: require("../../assets/images/background.png"),
      likes: 12891,
      caption:
        "Beautiful evening in Seoul. The city lights look incredible tonight.",
    },
    {
      id: "3",
      username: "zackjohn",
      location: "New York, USA",
      profileImg: require("../../assets/images/Inner Oval.png"),
      postImg: require("../../assets/images/logo.png"),
      likes: 32145,
      caption: "Working on some exciting projects. Stay tuned for updates!",
    },
    {
      id: "4",
      username: "craig_love",
      location: "Paris, France",
      profileImg: require("../../assets/images/Inner Oval.png"),
      postImg: require("../../assets/images/background.png"),
      likes: 8754,
      caption: "Coffee, croissants and a perfect morning view in Paris.",
    },
    {
      id: "5",
      username: "kieron_d",
      location: "London, UK",
      profileImg: require("../../assets/images/Inner Oval.png"),
      postImg: require("../../assets/images/instagram.png"),
      likes: 22019,
      caption:
        "Weekend adventures with friends. Had an amazing time exploring the city.",
    },
  ];
  const renderpost = ({ item }: { item: PostItem }) => {
    return (
      <View>
        <View style={homestyle.postHeader}>
          <View style={homestyle.postUserInfo}>
            <Image
              resizeMode="contain"
              source={item.profileImg}
              style={homestyle.postprofileimg}
            />

            <TouchableOpacity style={homestyle.profileContainer}>
              <Text style={homestyle.postUsername}>{item.username}</Text>
              <Text style={homestyle.postLocation}>{item.location}</Text>
            </TouchableOpacity>
          </View>

          <Image
            resizeMode="contain"
            source={require("../../assets/images/More.png")}
          />
        </View>
        
        <Image
          resizeMode="contain"
          source={item.postImg}
          style={homestyle.postImage}
        />

        <View style={homestyle.postbelowrow}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Image
              resizeMode="contain"
              source={require("../../assets/images/Like.png")}
              style={homestyle.iconimg}
            />
            <Image
              resizeMode="contain"
              source={require("../../assets/images/Comment.png")}
              style={homestyle.iconimg}
            />
            <Image
              resizeMode="contain"
              source={require("../../assets/images/Messanger.png")}
              style={homestyle.iconimg}
            />
          </View>

          <Image
            resizeMode="contain"
            source={require("../../assets/images/Save.png")}
            style={homestyle.iconimg}
          />
        </View>

        <View style={homestyle.likesRow}>
          <Image
            resizeMode="contain"
            source={require("../../assets/images/Inner Oval.png")}
            style={{ height: 25, width: 25 }}
          />
          <Text>
            Liked by {item.username} and {item.likes.toLocaleString()} others
          </Text>
        </View>

        <View style={homestyle.captionContainer}>
          <Text style={homestyle.captionText}>{item.caption}</Text>
        </View>
      </View>
    );
  };
  const renderStoryItem = ({ item }: { item: StoryItem }) => (
    <View style={homestyle.storyContainer}>
      <Image
        resizeMode="contain"
        source={require("../../assets/images/Inner Oval.png")}
        style={homestyle.storyimg}
      />
      <Text style={homestyle.usernameText} numberOfLines={1}>
        {item.username}
      </Text>
    </View>
  );
  return (
    <SafeAreaView style={homestyle.view}>
      <View style={homestyle.toprow}>
        <Image
          resizeMode="contain"
          source={require("../../assets/images/Camera Icon.png")}
          style={homestyle.iconimg}
        />
        <Image
          resizeMode="contain"
          source={require("../../assets/images/Instagram Logo.png")}
          style={homestyle.logo}
        />
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Image
            resizeMode="contain"
            source={require("../../assets/images/Camera Icon.png")}
            style={homestyle.iconimg}
          />
          <Image
            resizeMode="contain"
            source={require("../../assets/images/Messanger.png")}
            style={homestyle.iconimg}
          />
        </View>
      </View>
      <FlatList
        ListHeaderComponent={
          <FlatList
            data={mockStories}
            keyExtractor={(item: StoryItem) => item.id}
            renderItem={renderStoryItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={homestyle.row}
          />
        }
        data={posts}
        renderItem={renderpost}
        keyExtractor={(item: PostItem) => item.id}
      />
    </SafeAreaView>
  );
}
const homestyle = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "white",
  },
  row: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    gap: 5,
  },
  storyContainer: {
    alignItems: "center",
    width: 70,
  },
  storyimg: {
    height: 70,
    width: 70,
    marginBottom: 5,
    marginHorizontal: 10,
    borderWidth: 2,
    borderRadius: 50,
  },
  usernameText: {
    color: "grey",
    fontSize: 12,
  },
  toprow: {
    flexDirection: "row",
    marginHorizontal: 10,
    justifyContent: "space-between",
  },
  iconimg: {
    height: 25,
    width: 25,
  },
  logo: {
    height: 30,
    alignSelf: "center",
  },

  postprofileimg: {
    height: 35,
    width: 35,
  },
  postbelowrow: {
    flexDirection: "row",
    margin: 10,
    justifyContent: "space-between",
  },
  postHeader: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },

  postUserInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  profileContainer: {
    marginHorizontal: 10,
  },

  postUsername: {
    fontSize: 13,
    fontWeight: "600",
  },

  postLocation: {
    fontSize: 12,
    color: "#666",
  },

  postImage: {
    width: "100%",
  },

  likesRow: {
    flexDirection: "row",
    marginHorizontal: 10,
    gap: 10,
    alignItems: "center",
  },

  captionContainer: {
    marginHorizontal: 10,
    marginTop: 5,
  },

  captionText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
