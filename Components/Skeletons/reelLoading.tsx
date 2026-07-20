import { Dimensions, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const tabBarHeight = 60;
export default function Reelloading() {
  return (
    <SafeAreaView style={{ height: SCREEN_HEIGHT }}>
      <StatusBar barStyle={"light-content"} backgroundColor={"black"} />
      <View style={[styles.page, { height: SCREEN_HEIGHT - tabBarHeight }]}>
        <View style={styles.sideIcons}>
          <View style={styles.iconBlock} />
          <View style={styles.iconBlock} />
          <View style={styles.iconBlock} />
          <View style={styles.iconBlock} />
          <View style={styles.iconBlock} />
        </View>

        <View style={styles.bottomInfo}>
          <View style={styles.userRow}>
            <View style={styles.avatar} />
            <View style={styles.usernameLine} />
            <View style={styles.followBtn} />
          </View>
          <View style={styles.captionLine} />
          <View style={[styles.captionLine, { width: "60%" }]} />
          <View style={styles.viewsLine} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    width: "100%",
    backgroundColor: "#b5b5b5",
    justifyContent: "flex-end",
  },
  sideIcons: {
    position: "absolute",
    right: 15,
    bottom: 20,
    gap: 20,
    alignItems: "center",
  },
  iconBlock: {
    height: 35,
    width: 35,
    borderRadius: 17,
    backgroundColor: "#dcdcdc",
  },
  bottomInfo: {
    paddingBottom: 10,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: "#dcdcdc",
  },
  usernameLine: {
    height: 10,
    width: 100,
    borderRadius: 5,
    backgroundColor: "#dcdcdc",
    marginHorizontal: 10,
  },
  followBtn: {
    height: 30,
    width: 70,
    borderRadius: 5,
    backgroundColor: "#dcdcdc",
  },
  captionLine: {
    height: 10,
    width: "80%",
    borderRadius: 5,
    backgroundColor: "#dcdcdc",
    marginHorizontal: 20,
    marginBottom: 8,
  },
  viewsLine: {
    height: 8,
    width: "50%",
    borderRadius: 4,
    backgroundColor: "#dcdcdc",
    marginHorizontal: 20,
    marginTop: 6,
  },
});
