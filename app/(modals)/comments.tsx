import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { API } from "@/services/api";
import { useLocalSearchParams } from "expo-router";

interface Comment {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: { id: number; username: string };
}
export default function comments() {
  const { userId } = useLocalSearchParams();
  const [comments, setcomments] = useState<Comment[]>([]);
  const fetchcomments = async () => {
    try {
      const commentsresponse = await API.get(`/comments/post/${userId}`);
      setcomments(commentsresponse.data.comments);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchcomments();
  }, [userId]);
  return (
    <View
      style={{
        flex: 1,
        height: "60%",
        backgroundColor: "rgb(252, 252, 240)",
        paddingTop: 100,
      }}
    >
      <View
        style={{
          width: 70,
          height: 3,
          backgroundColor: "grey",
          alignSelf: "center",
          justifyContent: "center",
          borderRadius: 5,
        }}
      />
      <Text
        style={{
          alignSelf: "center",
          justifyContent: "center",
          borderRadius: 5,
        }}
      >
        comments
      </Text>
      {comments.length === 0 ? (
        <Text
          style={{
            alignSelf: "center",
            justifyContent: "center",
            marginTop: 100,
          }}
        >
          no ccommets
        </Text>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 15, flexDirection: "row" }}>
              <View style={{ backgroundColor:"f4f4f4",marginBlock:5,}}>
                <Image
                  source={{ uri: `https://picsum.photos/id/${item.id}` }}
                />
                <Text style={{ fontWeight: "bold", marginLeft: 20 }}>
                  {item.user.username}
                </Text>
                <Text style={{ color: "grey", marginLeft: 20 }}>
                  {item.body}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
