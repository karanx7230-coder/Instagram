import { useUser } from "@/context/UserContext";
import { supabase } from "@/services/supabase";
import { Feather } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

type User = {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string;
};
type LastMessageInfo = {
  text: string;
  time: string;
  senderId: string;
  read: boolean;
};

function formatMessageTime(isoString: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString();
}

export default function Messseges() {
  const { user, loading: userLoading } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [lastMessages, setLastMessages] = useState<
    Record<string, LastMessageInfo>
  >({});
  const fetchInboxData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      setCurrentUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, bio, avatar_url")
        .neq("id", user.id);

      if (error) {
        console.log("fetch users failed", error);
        return;
      }
      setUsers(data as User[]);

      const { data: conversations, error: convoError } = await supabase
        .from("conversations")
        .select("id, user1_id, user2_id, last_message, last_message_at")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      if (!convoError && conversations) {
        const messageMap: Record<string, LastMessageInfo> = {};

        for (const convo of conversations) {
          const otherUserId =
            convo.user1_id === user.id ? convo.user2_id : convo.user1_id;

          if (convo.last_message) {
            const { data: lastMsgRow } = await supabase
              .from("messages")
              .select("sender_id, read_at")
              .eq("conversation_id", convo.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();

            messageMap[otherUserId] = {
              text: convo.last_message,
              time: convo.last_message_at ?? "",
              senderId: lastMsgRow?.sender_id ?? "",
              read: !!lastMsgRow?.read_at,
            };
          }
        }

        setLastMessages(messageMap);
      }
    } catch (error) {
      console.log("failed", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchInboxData();
    }, [fetchInboxData]),
  );

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("conversations-inbox")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
        },
        (payload) => {
          const updatedConvo = payload.new as {
            id: string;
            user1_id: string;
            user2_id: string;
            last_message: string | null;
            last_message_at: string | null;
          };

          const isMine =
            updatedConvo.user1_id === user.id ||
            updatedConvo.user2_id === user.id;

          if (!isMine || !updatedConvo.last_message) return;

          const otherUserId =
            updatedConvo.user1_id === user.id
              ? updatedConvo.user2_id
              : updatedConvo.user1_id;

          setLastMessages((prev) => ({
            ...prev,
            [otherUserId]: {
              text: updatedConvo.last_message!,
              time: updatedConvo.last_message_at ?? "",
              senderId: prev[otherUserId]?.senderId ?? "",
              read: false,
            },
          }));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  const openOrCreateChat = async (otherUser: User) => {
    if (!currentUserId) return;

    const [u1, u2] = [currentUserId, otherUser.id].sort();

    const { data: existing, error: findErr } = await supabase
      .from("conversations")
      .select("id")
      .eq("user1_id", u1)
      .eq("user2_id", u2)
      .maybeSingle();

    if (findErr) {
      console.log("check conversation failed", findErr);
      return;
    }

    if (existing) {
      router.push({
        pathname: "/chat/[id]",
        params: { id: existing.id, otherUsername: otherUser.username },
      });
      return;
    }

    const { data: newConvo, error: createErr } = await supabase
      .from("conversations")
      .insert({ user1_id: u1, user2_id: u2 })
      .select("id")
      .single();

    if (createErr) {
      console.log("create conversation failed", createErr);
      return;
    }

    router.push({
      pathname: "/chat/[id]",
      params: { id: newConvo.id, otherUsername: otherUser.username },
    });
  };
  const rendermessege = useCallback(
    ({ item }: { item: User }) => {
      return (
        <TouchableOpacity
          onPress={() => openOrCreateChat(item)}
          style={messagestyles.messageRow}
        >
          <View style={messagestyles.messageLeft}>
            <TouchableOpacity onPress={() => openOrCreateChat(item)}>
              <Image
                source={{ uri: item.avatar_url }}
                style={messagestyles.messageAvatar}
              />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={messagestyles.messageUsername}>{item.username}</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 10,
                  gap: 4,
                }}
              >
                <Text
                  style={[messagestyles.messageActiveTime, { flexShrink: 1 }]}
                  numberOfLines={1}
                >
                  {lastMessages[item.id]?.text ?? "Start a chat"}
                </Text>
                {lastMessages[item.id]?.time && (
                  <Text style={messagestyles.messageActiveTime}>
                    · {formatMessageTime(lastMessages[item.id].time)}
                  </Text>
                )}
              </View>
            </View>
          </View>
          <Feather name="camera" size={28} color="#4d4d4d" />
        </TouchableOpacity>
      );
    },
    [openOrCreateChat, lastMessages],
  );
  if (loading || userLoading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color={"blue"} />
      </View>
    );
  }

  return (
    <SafeAreaView style={messagestyles.container} edges={["top"]}>
      <View style={messagestyles.header}>
        <View style={messagestyles.headerLeft}>
          <Feather
            name="chevron-left"
            size={27}
            color="black"
            style={messagestyles.chevronIcon}
          />
          <Text style={messagestyles.headerTitle}>karan_7230</Text>
          <Feather
            name="chevron-down"
            size={14}
            color="black"
            style={messagestyles.chevronIcon}
          />
        </View>
        <View style={messagestyles.headerRight}>
          <Feather name="video" size={29} color="black" />
          <Feather name="edit" size={26} color="black" />
        </View>
      </View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        style={messagestyles.messagesList}
        ListHeaderComponent={
          <View>
            <TouchableOpacity style={messagestyles.searchBar}>
              <Feather name="search" size={18} color="#b5b5b5" />
              <Text style={messagestyles.searchText}>Search</Text>
            </TouchableOpacity>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={messagestyles.notesList}
              contentContainerStyle={messagestyles.notesRow}
            >
              <View
                style={{
                  marginLeft: 10,
                  alignItems: "center",
                  width: 75,
                  paddingTop: 18,
                }}
              >
                <View style={{ position: "relative" }}>
                  <Image
                    source={{ uri: user?.avatar_url }}
                    style={messagestyles.noteImage}
                  />
                  <View style={messagestyles.addNoteContainer}>
                    <Feather name="plus" size={12} color={"white"} />
                  </View>
                </View>
                <Text
                  style={messagestyles.noteUsername}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Your note
                </Text>
              </View>
              {users.map((item) => (
                <View
                  key={item.id}
                  style={{ alignItems: "center", width: 75, paddingTop: 18 }}
                >
                  <Image
                    source={{ uri: item.avatar_url }}
                    style={messagestyles.noteImage}
                  />
                  <Text numberOfLines={1} style={messagestyles.noteUsername}>
                    {item.username}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={messagestyles.messagesHeader}>
              <Text style={messagestyles.messagesTitle}>messages</Text>
              <Text style={messagestyles.requestsText}>Requests(3)</Text>
            </View>
          </View>
        }
        renderItem={rendermessege}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ color: "#777" }}>No chats yet. Start one!</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 70 }}
      />
    </SafeAreaView>
  );
}

const messagestyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "white",
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    height: 27,
    width: 27,
    resizeMode: "contain",
  },
  headerTitle: {
    color: "#000000",
    marginLeft: 10,
    fontSize: 22,
    fontWeight: "bold",
  },
  chevronIcon: {
    marginLeft: 4,
    alignSelf: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#dcdcdc97",
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 15,
    marginTop: 10,
    borderRadius: 15,
  },
  searchText: {
    color: "#777777",
    marginLeft: 10,
  },
  notesList: {
    height: 110,
    marginVertical: 5,
  },
  notesRow: {
    flexDirection: "row",
  },
  noteImage: {
    height: 65,
    width: 65,
    resizeMode: "cover",
    borderRadius: 50,
  },
  noteOnlineDot: {
    backgroundColor: "#4cd964",
    position: "absolute",
    bottom: 0,
    right: 0,
    height: 16,
    width: 16,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 8,
  },
  addNoteContainer: {
    backgroundColor: "#0095f6",
    position: "absolute",
    bottom: 0,
    right: 0,
    height: 22,
    width: 22,
    borderRadius: 11,
    borderColor: "white",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 11,
  },
  noteUsername: {
    fontSize: 13,
    marginVertical: 5,
    color: "#777777",
    textAlign: "center",
    width: 65,
  },
  noteBubble: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    position: "absolute",
    top: -18,
    alignSelf: "center",
    minWidth: 40,
    maxWidth: 75,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  noteBubbleText: {
    fontSize: 10,
    color: "#262626",
    textAlign: "center",
    fontWeight: "500",
  },
  noteBubbleTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#ffffff",
    position: "absolute",
    bottom: -4,
    alignSelf: "center",
  },
  messagesList: {
    flex: 1,
  },
  messagesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginTop: 10,
  },
  messagesTitle: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
  requestsText: {
    color: "#00a6ff",
    fontSize: 18,
    fontWeight: "500",
  },
  messageRow: {
    margin: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  messageLeft: {
    flexDirection: "row",
  },
  messageAvatar: {
    height: 55,
    width: 55,
    borderRadius: 50,
  },
  messageUsername: {
    color: "#000000",
    marginLeft: 10,
    marginTop: 7,
    fontSize: 18,
    fontWeight: "bold",
  },
  messageActiveTime: {
    color: "#000000",
    marginLeft: 10,
    fontSize: 12,
    maxWidth: 220,
  },
});
