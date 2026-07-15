import { StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Postloading() {
  return (
    <SafeAreaView>
      <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />
      <View style={styles.divider} />

      <View style={styles.postHeader}>
        <View style={styles.postUserInfo}>
          <View style={styles.postprofileimg} />
          <View style={styles.profileContainer}>
            <View style={styles.usernameLine} />
            <View style={styles.locationLine} />
          </View>
        </View>
        <View style={styles.dotsicon} />
      </View>

      <View style={styles.postImage} />

      <View style={styles.postbelowrow}>
        <View style={styles.iconRow}>
          <View style={styles.iconimg} />
          <View style={styles.iconimg} />
          <View style={styles.iconimg} />
        </View>
        <View style={styles.iconimg} />
      </View>

      <View style={styles.likesRow}>
        <View style={styles.likedByAvatar} />
        <View style={styles.likedByAvatar} />
        <View style={styles.likesLine} />
      </View>

      <View style={styles.captionContainer}>
        <View style={styles.captionLine} />
        <View style={[styles.captionLine, { width: "60%" }]} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconimg: {
    height: 25,
    width: 25,
    borderRadius: 11,
    backgroundColor: "#dcdcdc",
  },

  iconRow: {
    flexDirection: "row",
    gap: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e5e5",
    width: "100%",
  },

  postHeader: {
    flexDirection: "row",
    marginHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  postUserInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  postprofileimg: {
    height: 35,
    width: 35,
    borderRadius: 17,
    backgroundColor: "#dcdcdc",
  },
  profileContainer: {
    marginLeft: 10,
  },
  usernameLine: {
    height: 10,
    width: 110,
    borderRadius: 5,
    backgroundColor: "#dcdcdc",
    marginBottom: 6,
  },
  locationLine: {
    height: 8,
    width: 80,
    borderRadius: 4,
    backgroundColor: "#dcdcdc",
  },
  dotsicon: {
    height: 18,
    width: 18,
    borderRadius: 9,
    backgroundColor: "#dcdcdc",
  },
  postImage: {
    height: 400,
    width: "100%",
    marginTop: 10,
    backgroundColor: "#dcdcdc",
  },
  postbelowrow: {
    flexDirection: "row",
    marginHorizontal: 10,
    justifyContent: "space-between",
    marginTop: 10,
  },
  likesRow: {
    flexDirection: "row",
    marginHorizontal: 10,
    gap: 6,
    alignItems: "center",
    marginTop: 10,
  },
  likedByAvatar: {
    height: 22,
    width: 22,
    borderRadius: 11,
    backgroundColor: "#dcdcdc",
  },
  likesLine: {
    height: 10,
    width: 150,
    borderRadius: 5,
    backgroundColor: "#dcdcdc",
    marginLeft: 4,
  },
  captionContainer: {
    marginHorizontal: 10,
    marginTop: 10,
    gap: 6,
  },
  captionLine: {
    height: 10,
    width: "90%",
    borderRadius: 5,
    backgroundColor: "#dcdcdc",
  },
});
