import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Note = {
  id: string;
  username: string;
  avatar: string;
  note: string;
  isSelf: boolean;
  active?: boolean;
};

type Chat = {
  id: string;
  username: string;
  avatar: string;
  message: string;
  time: string;
  unread: boolean;
  active: boolean;
};

const NOTES: Note[] = [
  {
    id: "0",
    username: "Your note",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
    note: "Leave a note",
    isSelf: true,
  },
  {
    id: "1",
    username: "alex_jones",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    note: "Bored at work 😴",
    isSelf: false,
    active: true,
  },
  {
    id: "2",
    username: "sophia_w",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    note: "Coffee time ☕",
    isSelf: false,
    active: true,
  },
  {
    id: "3",
    username: "johndoe_92",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    note: "Gym time 🏋️",
    isSelf: false,
    active: true,
  },
  {
    id: "4",
    username: "emily.rose",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80",
    note: "Movie night 🍿",
    isSelf: false,
    active: false,
  },
];

const CHATS: Chat[] = [
  {
    id: "1",
    username: "alex_jones",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    message: "Active 10m ago",
    time: "",
    unread: false,
    active: true,
  },
  {
    id: "2",
    username: "sophia_williams",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    message: "Sent a reel",
    time: "2h",
    unread: true,
    active: true,
  },
  {
    id: "3",
    username: "johndoe_92",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    message: "Haha that's awesome! Let's go!",
    time: "4h",
    unread: false,
    active: true,
  },
  {
    id: "4",
    username: "emily.rose",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80",
    message: "You: See you tonight!",
    time: "1d",
    unread: false,
    active: false,
  },
  {
    id: "5",
    username: "design_craft",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80",
    message: "Liked your message",
    time: "2d",
    unread: true,
    active: true,
  },
  {
    id: "6",
    username: "lucas_gold",
    avatar: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=200&auto=format&fit=crop&q=80",
    message: "Active yesterday",
    time: "",
    unread: false,
    active: false,
  },
  {
    id: "7",
    username: "travel_bug",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&auto=format&fit=crop&q=80",
    message: "You sent a photo",
    time: "3d",
    unread: false,
    active: false,
  },
];

export default function Messeges() {
  const renderNoteItem = (item: Note) => {
    return (
      <View key={item.id} style={styles.noteItem}>
        <View style={styles.noteAvatarContainer}>
          {/* Note Bubble */}
          <View style={styles.noteBubble}>
            <Text
              style={[
                styles.noteBubbleText,
                item.isSelf && { color: "#737373" },
              ]}
              numberOfLines={2}
            >
              {item.note}
            </Text>
            <View style={styles.noteBubbleTail} />
            <View style={styles.noteBubbleTailSmall} />
          </View>

          {/* Profile Image */}
          <Image source={{ uri: item.avatar }} style={styles.noteAvatar} />

          {/* Active badge / Plus overlay */}
          {item.isSelf ? (
            <View style={styles.plusIconContainer}>
              <Feather name="plus" size={12} color="white" />
            </View>
          ) : item.active ? (
            <View style={styles.activeDot} />
          ) : null}
        </View>
        <Text style={styles.noteUsername} numberOfLines={1}>
          {item.isSelf ? "Your note" : item.username}
        </Text>
      </View>
    );
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    return (
      <TouchableOpacity style={styles.chatRow} activeOpacity={0.7}>
        <View style={styles.chatAvatarContainer}>
          <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
          {item.active && <View style={styles.chatActiveDot} />}
        </View>

        <View style={styles.chatInfoContainer}>
          <Text
            style={[styles.chatUsername, item.unread && styles.unreadText]}
            numberOfLines={1}
          >
            {item.username}
          </Text>
          <View style={styles.chatMessageRow}>
            <Text
              style={[
                styles.chatMessageText,
                item.unread && styles.unreadMessageText,
              ]}
              numberOfLines={1}
            >
              {item.message}
            </Text>
            {item.time ? (
              <Text
                style={[
                  styles.chatTimeText,
                  item.unread && styles.unreadTimeText,
                ]}
              >
                {" "}
                • {item.time}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.chatRightContainer}>
          {item.unread ? (
            <View style={styles.unreadBlueDot} />
          ) : (
            <Feather name="camera" size={20} color="#737373" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={18}
          color="#737373"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#737373"
          style={styles.searchInput}
          editable={false}
        />
      </View>

      {/* Notes Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.notesListContainer}
      >
        {NOTES.map(renderNoteItem)}
      </ScrollView>

      {/* Tab/Filter Row */}
      <View style={styles.tabRow}>
        <Text style={styles.tabTextActive}>Messages</Text>
        <TouchableOpacity>
          <Text style={styles.tabTextInactive}>Requests (3)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Top Navigation Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton}>
            <Image
              source={require("../../assets/images/Back.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>karan_7230</Text>
            <Feather
              name="chevron-down"
              size={14}
              color="black"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconButton}>
            <Feather name="video" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconButton}>
            <Feather name="edit" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content (Chats List) */}
      <FlatList
        data={CHATS}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    paddingRight: 16,
    paddingVertical: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  headerIconButton: {
    padding: 4,
  },
  listContent: {
    paddingBottom: 24,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#efefef",
    borderRadius: 10,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 38,
    marginTop: 14,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#262626",
    padding: 0,
  },
  notesListContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 18,
  },
  noteItem: {
    alignItems: "center",
    width: 72,
  },
  noteAvatarContainer: {
    position: "relative",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 6,
  },
  noteAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#e1e1e1",
  },
  noteBubble: {
    position: "absolute",
    top: -24,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    maxWidth: 80,
    minHeight: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    elevation: 2,
    zIndex: 10,
  },
  noteBubbleText: {
    fontSize: 10,
    color: "#000000",
    textAlign: "center",
    fontWeight: "500",
  },
  noteBubbleTail: {
    position: "absolute",
    bottom: -3,
    left: 24,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f2f2f2",
    transform: [{ rotate: "45deg" }],
    zIndex: -1,
  },
  noteBubbleTailSmall: {
    position: "absolute",
    bottom: -6,
    left: 20,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#f2f2f2",
    zIndex: -1,
  },
  plusIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#0095f6",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  activeDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#4eca30",
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  noteUsername: {
    fontSize: 11,
    color: "#737373",
    textAlign: "center",
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  tabTextActive: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  tabTextInactive: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0095f6",
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chatAvatarContainer: {
    position: "relative",
  },
  chatAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e1e1e1",
  },
  chatActiveDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4eca30",
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  chatInfoContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  chatUsername: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 2,
  },
  unreadText: {
    fontWeight: "700",
  },
  chatMessageRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatMessageText: {
    fontSize: 13,
    color: "#737373",
    maxWidth: "80%",
  },
  unreadMessageText: {
    color: "#000000",
    fontWeight: "600",
  },
  chatTimeText: {
    fontSize: 13,
    color: "#737373",
  },
  unreadTimeText: {
    color: "#000000",
    fontWeight: "600",
  },
  chatRightContainer: {
    paddingLeft: 8,
    justifyContent: "center",
    alignItems: "center",
    width: 32,
  },
  unreadBlueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0095f6",
  },
});
