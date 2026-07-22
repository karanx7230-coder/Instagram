import { supabase } from "@/services/supabase";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@/context/UserContext";

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  created_at: string;
  read_at: string | null;
};

export default function ChatScreen() {
  const { id, otherUsername } = useLocalSearchParams<{
    id: string;
    otherUsername: string;
  }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const { user } = useUser();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!user) return;
    const init = async () => {
      await fetchMessages();
      await markAsRead(user.id);
    };
    init();
  }, [id, user]);

  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`messages-${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.find((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true })
      .limit(50);

    if (error) {
      console.log("fetch messages failed", error);
      return;
    }
    setMessages(data as Message[]);
  };

  const markAsRead = async (uid: string) => {
    await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("conversation_id", id)
      .neq("sender_id", uid)
      .is("read_at", null);
  };

  const sendMessage = async () => {
    if (!text.trim() || !user) return;

    const tempId = "temp-" + Date.now();
    const body = text.trim();
    const nowIso = new Date().toISOString();

    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        conversation_id: id,
        sender_id: user.id,
        text: body,
        created_at: nowIso,
        read_at: null,
      },
    ]);
    setText("");

    const { data, error } = await supabase
      .from("messages")
      .insert({ conversation_id: id, sender_id: user.id, text: body })
      .select()
      .single();

    if (error) {
      console.log("send failed", error);
      return;
    }

    setMessages((prev) => prev.map((m) => (m.id === tempId ? (data as Message) : m)));

    await supabase
      .from("conversations")
      .update({ last_message: body, last_message_at: nowIso })
      .eq("id", id);
  };

  return (
    <SafeAreaView style={chatStyles.container} edges={["top"]}>
      <View style={chatStyles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={27} color="black" />
        </TouchableOpacity>
        <Text style={chatStyles.headerTitle}>{otherUsername}</Text>
        <View style={{ width: 27 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 10 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            const isMe = item.sender_id === user?.id;
            return (
              <View
                style={[
                  chatStyles.bubble,
                  isMe ? chatStyles.bubbleMe : chatStyles.bubbleOther,
                ]}
              >
                <Text style={{ color: isMe ? "#fff" : "#000" }}>{item.text}</Text>
                {isMe && item.read_at && <Text style={chatStyles.seenText}>Seen</Text>}
              </View>
            );
          }}
        />

        <View style={chatStyles.inputRow}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message..."
            style={chatStyles.input}
          />
          <TouchableOpacity onPress={sendMessage} style={chatStyles.sendBtn}>
            <Feather name="send" size={20} color="#0095f6" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const chatStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  bubble: {
    padding: 10,
    borderRadius: 16,
    marginVertical: 4,
    maxWidth: "75%",
  },
  bubbleMe: {
    backgroundColor: "#0095f6",
    alignSelf: "flex-end",
  },
  bubbleOther: {
    backgroundColor: "#f0f0f0",
    alignSelf: "flex-start",
  },
  seenText: { fontSize: 10, color: "#dbeeff", marginTop: 2, textAlign: "right" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendBtn: { padding: 6 },
});