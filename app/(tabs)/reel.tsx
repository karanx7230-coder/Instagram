import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NewPost() {
  return (
    <View style={reelstyles.view}>
      <ImageBackground
        source={require("../../assets/images/mr.png")}
        style={reelstyles.ImageBackground}
      >
        <View style={reelstyles.sideIconsContainer}>
          <TouchableOpacity>
            <Image
              source={require("../../assets/images/Like.png")}
              style={reelstyles.iconimg}
            />
            <Text>34</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../../assets/images/Comment.png")}
              style={reelstyles.iconimg}
            />
            <Text>43</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../../assets/images/Messanger.png")}
              style={reelstyles.iconimg}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../../assets/images/Save.png")}
              style={reelstyles.iconimg}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../../assets/images/More.png")}
              style={reelstyles.iconimg}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../../assets/images/Rectangle.png")}
              style={[reelstyles.iconimg, reelstyles.rectangleImg]}
            />
          </TouchableOpacity>
        </View>
        <View>
          <View style={reelstyles.userRow}>
            <Image
              style={reelstyles.avatarImg}
              source={require("../../assets/images/cry.png")}
            />
            <Text style={reelstyles.usernameText}>username</Text>
            <TouchableOpacity style={reelstyles.followButton}>
              <Text style={reelstyles.followText}>Follow</Text>
            </TouchableOpacity>
          </View>
          <Text style={reelstyles.captionText}>
            Excepteur reprehenderit cillum aliquip ad enim Lorem labore mollit
            consequat elit est fugiat ut amet.
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const reelstyles = StyleSheet.create({
  view: {
    flex: 1,
  },
  ImageBackground: {
    position: "absolute",
    height: "100%",
    width: "100%",
    marginBottom: 75,
    justifyContent: "flex-end",
  },
  iconimg: {
    height: 35,
    width: 35,
    resizeMode: "contain",
  },
  sideIconsContainer: {
    position: "absolute",
    alignItems: "flex-end",
    right: 15,
    gap: 20,
  },
  rectangleImg: {
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 5,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  avatarImg: {
    height: 42,
    width: 42,
    borderRadius: 21,
    resizeMode: "contain",
  },
  usernameText: {
    color: "white",
    marginHorizontal: 20,
  },
  followButton: {
    marginHorizontal: 10,
    paddingHorizontal: 15,
    height: 30,
    backgroundColor: "#ffffff36",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  followText: {
    color: "white",
  },
  captionText: {
    paddingBottom: 20,
    left: 20,
    color: "white",
    width: "90%",
  },
});
