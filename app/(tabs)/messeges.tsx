import { useUser } from "@/context/UserContext";
import { supabase } from "@/services/supabase";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
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
export default function Messseges() {
  const { user, loading: userLoading } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
// AB ISSE REPLACE KARO
useEffect(() => {
  if (!user) return; // context abhi load nahi hua, wait karo

  const init = async () => {
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
    } catch (error) {
      console.log("failed", error);
    } finally {
      setLoading(false);
    }
  };
  init();
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

 // AB ISSE REPLACE KARO
if (loading || userLoading || !user) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={"large"} color={"blue"} />
    </View>
  );
}

  const rendernote = ({ item }: { item: User }) => {
    return (
      <View style={{ alignItems: "center", width: 75, paddingTop: 18 }}>
        <Image
          source={{ uri: item.avatar_url }}
          style={messegestyles.noteImage}
        />
        <Text numberOfLines={1} style={messegestyles.noteUsername}>
          {item.username}
        </Text>
      </View>
    );
  };

  // rendermessege mein
  const rendermessege = ({ item }: { item: User }) => {
    return (
      <TouchableOpacity
        onPress={() => openOrCreateChat(item)}
        style={messegestyles.messageRow}
      >
        <View style={messegestyles.messageLeft}>
          <TouchableOpacity onPress={() => openOrCreateChat(item)}>
            <Image
              source={{ uri: item.avatar_url }}
              style={messegestyles.messageAvatar}
            />
          </TouchableOpacity>
          <View>
            <Text style={messegestyles.messageUsername}>{item.username}</Text>
            <Text style={messegestyles.messageActiveTime}>
              {item.full_name}
            </Text>
          </View>
        </View>
        <Feather name="camera" size={28} color="#4d4d4d" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={messegestyles.container} edges={["top"]}>
      <View style={messegestyles.header}>
        <View style={messegestyles.headerLeft}>
          <Feather
            name="chevron-left"
            size={27}
            color="black"
            style={messegestyles.chevronIcon}
          />
          <Text style={messegestyles.headerTitle}>karan_7230</Text>
          <Feather
            name="chevron-down"
            size={14}
            color="black"
            style={messegestyles.chevronIcon}
          />
        </View>
        <View style={messegestyles.headerRight}>
          <Feather name="video" size={29} color="black" />
          <Feather name="edit" size={26} color="black" />
        </View>
      </View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        style={messegestyles.messagesList}
        ListHeaderComponent={
          <View>
            <TouchableOpacity style={messegestyles.searchBar}>
              <Feather name="search" size={18} color="#b5b5b5" />
              <Text style={messegestyles.searchText}>Search</Text>
            </TouchableOpacity>

            <FlatList
              data={users}
              keyExtractor={(item) => item.id}
              horizontal
              renderItem={rendernote}
              showsHorizontalScrollIndicator={false}
              style={messegestyles.notesList}
              contentContainerStyle={messegestyles.notesRow}
              ListHeaderComponent={
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
                      source={{ uri: user.avatar_url }}
                      style={messegestyles.noteImage}
                    />
                    <View style={messegestyles.addNoteContainer}>
                      <Feather name="plus" size={12} color={"white"} />
                    </View>
                  </View>
                  <Text
                    style={messegestyles.noteUsername}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Your note
                  </Text>
                </View>
              }
            />

            <View style={messegestyles.messagesHeader}>
              <Text style={messegestyles.messagesTitle}>Messeges</Text>
              <Text style={messegestyles.requestsText}>Requests(3)</Text>
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

const messegestyles = StyleSheet.create({
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
