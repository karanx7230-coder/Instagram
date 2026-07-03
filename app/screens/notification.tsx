import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notification() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>New</Text>

        <View style={styles.row}>
          <Image
            style={styles.avatar}
            source={require("../../assets/images/Inner Oval.png")}
          />
          <Text style={styles.notifText}>
            <Text style={styles.bold}>karennne </Text>
            liked your photo.
            <Text style={styles.time}>1h</Text>
          </Text>
          <Image
            style={styles.thumbnail}
            source={require("../../assets/images/post.png")}
          />
        </View>

        <Text style={styles.sectionTitle}>Today</Text>

        <View style={styles.row}>
          <View style={styles.stackedContainer}>
            <Image
              source={require("../../assets/images/Inner Oval.png")}
              style={[styles.stackedAvatar, { left: 0, zIndex: 1 }]}
            />
            <Image
              source={require("../../assets/images/Inner Oval.png")}
              style={[styles.stackedAvatar, { left: 20, top: 10, zIndex: 2 }]}
            />
          </View>
          <Text style={styles.notifText}>
            <Text style={styles.bold}>kiero_d, zackjohn </Text>
            and <Text style={styles.bold}>26 others</Text> liked your photo.
            <Text style={styles.time}>3h</Text>
          </Text>
          <Image
            style={styles.thumbnail}
            source={require("../../assets/images/post.png")}
          />
        </View>

        <Text style={styles.sectionTitle}>This Week</Text>

        <View style={styles.row}>
          <Image
            style={styles.avatar}
            source={require("../../assets/images/Inner Oval.png")}
          />
          <Text style={styles.notifText}>
            <Text style={styles.bold}>craig_love </Text>
            mentioned you in a comment: @jacob_w exactly..
            <Text style={styles.time}>2d</Text>
          </Text>
          <Image
            style={styles.thumbnail}
            source={require("../../assets/images/post.png")}
          />
        </View>

        <View style={styles.row}>
          <Image
            style={styles.avatar}
            source={require("../../assets/images/Inner Oval.png")}
          />
          <Text style={styles.notifText}>
            <Text style={styles.bold}>martini_rond </Text>
            started following you.
            <Text style={styles.time}>3d</Text>
          </Text>
          <TouchableOpacity style={styles.messageBtn}>
            <Text style={styles.messageBtnText}>Message</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Image
            style={styles.avatar}
            source={require("../../assets/images/Inner Oval.png")}
          />
          <Text style={styles.notifText}>
            <Text style={styles.bold}>maxjacobson </Text>
            started following you.
            <Text style={styles.time}>3d</Text>
          </Text>
          <TouchableOpacity style={styles.messageBtn}>
            <Text style={styles.messageBtnText}>Message</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Image
            style={styles.avatar}
            source={require("../../assets/images/Inner Oval.png")}
          />
          <Text style={styles.notifText}>
            <Text style={styles.bold}>mis_potter </Text>
            started following you.
            <Text style={styles.time}>3d</Text>
          </Text>
          <TouchableOpacity style={styles.followBtn}>
            <Text style={styles.followBtnText}>Follow</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>This Month</Text>

        <View style={styles.row}>
          <Image
            style={styles.avatar}
            source={require("../../assets/images/Inner Oval.png")}
          />
          <Text style={styles.notifText}>
            <Text style={styles.bold}>m_humphrey </Text>
            started following you.
            <Text style={styles.time}>3d</Text>
          </Text>
          <TouchableOpacity style={styles.messageBtn}>
            <Text style={styles.messageBtnText}>Message</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Image
            style={styles.avatar}
            source={require("../../assets/images/Inner Oval.png")}
          />
          <Text style={styles.notifText}>
            <Text style={styles.bold}>jammmie </Text>
            started following you.
            <Text style={styles.time}>3d</Text>
          </Text>
          <TouchableOpacity style={styles.messageBtn}>
            <Text style={styles.messageBtnText}>Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 10,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  stackedContainer: {
    width: 66,
    height: 54,
  },
  stackedAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: "absolute",
    borderWidth: 2,
    borderColor: "#fff",
  },
  notifText: {
    flex: 1,
    fontSize: 13.5,
    color: "#000",
    lineHeight: 19,
  },
  bold: {
    fontWeight: "700",
  },
  time: {
    color: "#8e8e8e",
    fontWeight: "400",
  },
  thumbnail: {
    width: 46,
    height: 46,
    borderRadius: 4,
  },
  messageBtn: {
    borderWidth: 1,
    borderColor: "#dbdbdb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  messageBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
  },
  followBtn: {
    backgroundColor: "#0095f6",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  followBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
});
