import { StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileLoading() {
  return (
    <SafeAreaView style={styles.view}>
      <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />

      {/* Top nav: back, username, menu */}
      <View style={styles.topNav}>
        <View style={styles.iconimg} />
        <View style={styles.usernameHeader} />
        <View style={styles.iconimg} />
      </View>

      {/* Avatar + stats row */}
      <View style={styles.avatarStatsRow}>
        <View style={styles.avatarImage} />
        <View style={styles.statsColumn}>
          <View style={styles.nameLine} />
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statNumber} />
              <View style={styles.statLabel} />
            </View>
            <View style={styles.statItem}>
              <View style={styles.statNumber} />
              <View style={styles.statLabel} />
            </View>
            <View style={styles.statItem}>
              <View style={styles.statNumber} />
              <View style={styles.statLabel} />
            </View>
          </View>
        </View>
      </View>

      {/* Bio lines */}
      <View style={styles.bioContainer}>
        <View style={styles.bioLine} />
        <View style={[styles.bioLine, { width: "50%" }]} />
      </View>

      {/* Edit profile button */}
      <View style={styles.editProfileButton} />

      {/* Highlights row */}
      <View style={styles.storiesRow}>
        <View style={styles.highlightItem}>
          <View style={styles.highlightCircle} />
          <View style={styles.highlightLabel} />
        </View>
        <View style={styles.highlightItem}>
          <View style={styles.highlightCircle} />
          <View style={styles.highlightLabel} />
        </View>
        <View style={styles.highlightItem}>
          <View style={styles.highlightCircle} />
          <View style={styles.highlightLabel} />
        </View>
        <View style={styles.highlightItem}>
          <View style={styles.highlightCircle} />
          <View style={styles.highlightLabel} />
        </View>
      </View>

      {/* Tabs row */}
      <View style={styles.tabsRow}>
        <View style={styles.tabButton}>
          <View style={styles.tabIcon} />
        </View>
        <View style={styles.tabButton}>
          <View style={styles.tabIcon} />
        </View>
      </View>

      {/* Post grid */}
      <View style={styles.gridRow}>
        <View style={styles.gridImage} />
        <View style={styles.gridImage} />
        <View style={styles.gridImage} />
      </View>
      <View style={styles.gridRow}>
        <View style={styles.gridImage} />
        <View style={styles.gridImage} />
        <View style={styles.gridImage} />
      </View>
      <View style={styles.gridRow}>
        <View style={styles.gridImage} />
        <View style={styles.gridImage} />
        <View style={styles.gridImage} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "white",
  },
  topNav: {
    flexDirection: "row",
    marginHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  iconimg: {
    height: 22,
    width: 22,
    borderRadius: 11,
    backgroundColor: "#dcdcdc",
  },
  usernameHeader: {
    height: 16,
    width: 120,
    borderRadius: 8,
    backgroundColor: "#dcdcdc",
  },
  avatarStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 16,
  },
  avatarImage: {
    height: 90,
    width: 90,
    borderRadius: 45,
    backgroundColor: "#dcdcdc",
  },
  statsColumn: {
    flex: 1,
    marginLeft: 20,
  },
  nameLine: {
    height: 12,
    width: 100,
    borderRadius: 6,
    backgroundColor: "#dcdcdc",
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: "row",
    gap: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    height: 12,
    width: 30,
    borderRadius: 6,
    backgroundColor: "#dcdcdc",
    marginBottom: 6,
  },
  statLabel: {
    height: 8,
    width: 45,
    borderRadius: 4,
    backgroundColor: "#dcdcdc",
  },
  bioContainer: {
    marginHorizontal: 20,
    marginTop: 16,
    gap: 6,
  },
  bioLine: {
    height: 10,
    width: "80%",
    borderRadius: 5,
    backgroundColor: "#dcdcdc",
  },
  editProfileButton: {
    height: 30,
    borderRadius: 4,
    backgroundColor: "#efefef",
    marginHorizontal: 20,
    marginVertical: 16,
  },
  storiesRow: {
    flexDirection: "row",
    marginHorizontal: 10,
    gap: 14,
  },
  highlightItem: {
    alignItems: "center",
  },
  highlightCircle: {
    height: 65,
    width: 65,
    borderRadius: 33,
    backgroundColor: "#dcdcdc",
  },
  highlightLabel: {
    height: 8,
    width: 40,
    borderRadius: 4,
    backgroundColor: "#dcdcdc",
    marginTop: 6,
  },
  tabsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    marginTop: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  tabIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#dcdcdc",
  },
  gridRow: {
    flexDirection: "row",
    gap: 1,
    marginTop: 1,
  },
  gridImage: {
    height: 150,
    width: "33%",
    backgroundColor: "#dcdcdc",
  },
});
