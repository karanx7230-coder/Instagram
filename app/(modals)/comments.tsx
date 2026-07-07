import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { API } from "@/services/api";

interface Comment {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: { id: number; username: string };
}

export default function Comments() {
  const { userId } = useLocalSearchParams();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/comments/post/${userId}`);
        setComments(res.data.comments);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [userId]);

  const handleSheetChange = useCallback((index: number) => {
    if (index === -1) router.back();
  }, []);
 
  return (
    <BottomSheet
      index={0}
      snapPoints={["50%", "90%"]}
      onChange={handleSheetChange}
      enablePanDownToClose
    >
      <Text style={styles.title}>Comments</Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} />
      ) : comments.length === 0 ? (
        <Text style={styles.emptyText}>No comments yet</Text>
      ) : (
        <BottomSheetFlatList
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.commentRow}>
              <Image
                source={{ uri: `https://picsum.photos/id/${item.id}/100` }}
                style={styles.avatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.username}>{item.user.username}</Text>
                <Text>{item.body}</Text>
              </View>
            </View>
          )}
        />
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: { textAlign: "center", fontWeight: "600", paddingVertical: 10 },
  emptyText: { textAlign: "center", marginTop: 50, color: "grey" },
  commentRow: { flexDirection: "row", paddingHorizontal: 15, marginBottom: 15 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10, backgroundColor: "#eee" },
  username: { fontWeight: "bold", fontSize: 13 },
});