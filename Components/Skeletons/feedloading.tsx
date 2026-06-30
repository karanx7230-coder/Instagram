import { StyleSheet, View } from "react-native";

export default function Homeloading() {
  return (
    <View style={styles.view}>
      <View style={styles.toprow}>
        <View style={styles.iconimg} />
        <View style={styles.logo} />
        <View style={styles.iconRow}>
          <View style={styles.iconimg} />
          <View style={styles.iconimg} />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.storyRow}>
        <View style={styles.storyContainer}>
          <View style={styles.storyimg} />
          <View style={styles.storyLabel} />
        </View>
        <View style={styles.storyContainer}>
          <View style={styles.storyimg} />
          <View style={styles.storyLabel} />
        </View>
        <View style={styles.storyContainer}>
          <View style={styles.storyimg} />
          <View style={styles.storyLabel} />
        </View>
        <View style={styles.storyContainer}>
          <View style={styles.storyimg} />
          <View style={styles.storyLabel} />
        </View>
        <View style={styles.storyContainer}>
          <View style={styles.storyimg} />
          <View style={styles.storyLabel} />
        </View>
        <View style={styles.storyContainer}>
          <View style={styles.storyimg} />
          <View style={styles.storyLabel} />
        </View>
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "white",
  },
  toprow: {
    flexDirection: "row",
    marginHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  iconimg: {
    height: 25,
    width: 25,
    borderRadius: 22,
    backgroundColor: "#dcdcdc",
  },
  logo: {
    height: 28,
    width: 150,
    borderRadius: 22,
    backgroundColor: "#dcdcdc",
    alignSelf: "center",
  },
  iconRow: {
    flexDirection: "row",
    gap: 10,
  },
  divider: {
    height: 1,
    marginTop: 10,
    backgroundColor: "#e5e5e5",
    width: "100%",
  },
  storyRow: {
    flexDirection: "row",
    gap: 14,
    marginHorizontal: 10,
    marginVertical: 14,
  },
  storyContainer: {
    alignItems: "center",
    width: 70,
  },
  storyimg: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: "#dcdcdc",
  },
  storyLabel: {
    height: 8,
    width: 50,
    marginTop: 6,
    borderRadius: 4,
    backgroundColor: "#dcdcdc",
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
