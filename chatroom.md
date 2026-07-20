import { Feather } from "@expo/vector-icons";
import  { useCallback, useMemo, useRef, useState } from "react";
import {
FlatList,
KeyboardAvoidingView,
Platform,
StyleSheet,
Text,
TextInput,
TouchableOpacity,
View,
type ListRenderItem,
type NativeScrollEvent,
type NativeSyntheticEvent,
} from "react-native";

type MessageSender = "me" | "other";

type ChatMessage = {
id: string;
text: string;
sender: MessageSender;
};

const DUMMY_MESSAGES: ChatMessage[] = [
{ id: "1", text: "Hey 👋", sender: "other" },
{ id: "2", text: "Hello!", sender: "me" },
{ id: "3", text: "How are you?", sender: "other" },
{ id: "4", text: "Doing great 😄", sender: "me" },
];

export default function Chatroom() {
const [messages, setMessages] = useState<ChatMessage[]>(() => DUMMY_MESSAGES);
const [text, setText] = useState<string>("");

const flatListRef = useRef<FlatList<ChatMessage> | null>(null);

const username = "karan_7230";
const avatarUri = "https://placehold.co/80x80/png";

const onSend = useCallback(() => {
const trimmed = text.trim();
if (!trimmed) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: trimmed,
      sender: "me",
    };

    setMessages((prev) => {
      const next = [...prev, newMessage];
      // Scroll after state update; FlatList ref will be valid.
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      });
      return next;
    });

    setText("");

}, [text]);

const renderItem = useCallback<ListRenderItem<ChatMessage>>(({ item }) => {
const isMe = item.sender === "me";
return (
<View style={[styles.messageRow, isMe ? styles.rowMe : styles.rowOther]}>
<View
style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]} >
<Text
style={[
styles.bubbleText,
isMe ? styles.bubbleTextMe : styles.bubbleTextOther,
]} >
{item.text}
</Text>
</View>
</View>
);
}, []);

const canSend = useMemo(() => text.trim().length > 0, [text]);

const onScrollToEndOnContentSizeChange = useCallback(() => {
flatListRef.current?.scrollToEnd({ animated: true });
}, []);

return (
<KeyboardAvoidingView
style={styles.container}
behavior={Platform.OS === "ios" ? "padding" : "height"}

    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.iconButton}
            accessibilityRole="button"
          >
            <Feather name="chevron-left" size={22} color="#000" />
          </TouchableOpacity>

          <View style={styles.avatarWrap}>
            {/* Local-only static image; no backend calls */}
            <View style={styles.avatarPlaceholder} />
          </View>

          <View style={styles.headerTextWrap}>
            <Text style={styles.username} numberOfLines={1}>
              {username}
            </Text>
            <Text style={styles.activeText}>Active now</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            accessibilityRole="button"
          >
            <Feather name="phone" size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            accessibilityRole="button"
          >
            <Feather name="video" size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            accessibilityRole="button"
          >
            <Feather name="info" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.headerDivider} />

      <FlatList
        ref={(r) => {
          flatListRef.current = r;
        }}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
      />

      <View style={styles.inputBar}>
        <TouchableOpacity
          style={styles.inputIconBtn}
          accessibilityRole="button"
        >
          <Feather name="camera" size={20} color="#000" />
        </TouchableOpacity>

        <View style={styles.textInputWrap}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message..."
            placeholderTextColor="#9a9a9a"
            style={styles.textInput}
            multiline
          />
        </View>

        <TouchableOpacity
          style={styles.inputIconBtn}
          accessibilityRole="button"
        >
          <Feather name="image" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.inputIconBtn}
          accessibilityRole="button"
        >
          <Feather name="mic" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sendBtn,
            canSend ? styles.sendBtnActive : styles.sendBtnInactive,
          ]}
          onPress={onSend}
          accessibilityRole="button"
          activeOpacity={0.8}
        >
          <Feather
            name="send"
            size={18}
            color={canSend ? "#0095f6" : "#bdbdbd"}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: "#fff",
},
header: {
paddingHorizontal: 12,
paddingTop: 10,
paddingBottom: 12,
flexDirection: "row",
alignItems: "center",
justifyContent: "space-between",
},
headerLeft: {
flexDirection: "row",
alignItems: "center",
gap: 10,
flex: 1,
},
headerRight: {
flexDirection: "row",
alignItems: "center",
gap: 14,
},
iconButton: {
width: 34,
height: 34,
borderRadius: 17,
alignItems: "center",
justifyContent: "center",
},
avatarWrap: {
width: 38,
height: 38,
borderRadius: 19,
overflow: "hidden",
backgroundColor: "#f2f2f2",
alignItems: "center",
justifyContent: "center",
},
avatarPlaceholder: {
width: 38,
height: 38,
borderRadius: 19,
backgroundColor: "#e8e8e8",
},
headerTextWrap: {
flexShrink: 1,
},
username: {
fontSize: 16,
fontWeight: "700",
color: "#000",
},
activeText: {
fontSize: 12,
color: "#6f6f6f",
marginTop: 2,
},
headerDivider: {
height: 1,
backgroundColor: "#ededed",
},
messagesContent: {
paddingHorizontal: 12,
paddingTop: 10,
paddingBottom: 110,
},
messageRow: {
marginVertical: 5,
},
rowMe: {
alignItems: "flex-end",
},
rowOther: {
alignItems: "flex-start",
},
bubble: {
maxWidth: "75%",
paddingVertical: 10,
paddingHorizontal: 12,
borderRadius: 16,
},
bubbleMe: {
backgroundColor: "#0095f6",
borderTopRightRadius: 6,
},
bubbleOther: {
backgroundColor: "#f1f1f1",
borderTopLeftRadius: 6,
},
bubbleText: {
fontSize: 14,
lineHeight: 18,
},
bubbleTextMe: {
color: "#fff",
},
bubbleTextOther: {
color: "#000",
},
inputBar: {
marginBottom: 100,
position: "absolute",
left: 0,
right: 0,
bottom: 0,
paddingHorizontal: 10,
paddingVertical: 10,
flexDirection: "row",
alignItems: "flex-end",
backgroundColor: "#fff",
borderTopWidth: 1,
borderTopColor: "#ededed",
gap: 8,
},
inputIconBtn: {
width: 38,
height: 38,
borderRadius: 19,
alignItems: "center",
justifyContent: "center",
},
textInputWrap: {
flex: 1,
borderRadius: 18,
backgroundColor: "#f2f2f2",
paddingHorizontal: 12,
paddingVertical: 8,
maxHeight: 110,
},
textInput: {
fontSize: 14,
color: "#000",
padding: 0,

},
sendBtn: {
width: 40,
height: 40,
borderRadius: 20,
alignItems: "center",
justifyContent: "center",
},
sendBtnActive: {
backgroundColor: "#eaf6ff",
},
sendBtnInactive: {
backgroundColor: "#f0f0f0",
},
});
