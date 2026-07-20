import { supabase } from "@/services/supabase";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Profile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
};

export default function SearchUser() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchUsers = async (text: string) => {
    if (!text.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url")
        .ilike("username", `%${text}%`)
        .limit(20);

      if (error) {
        console.log("search error", error);
        setResults([]);
      } else {
        setResults(data ?? []);
      }
    } catch (error) {
      console.log("search failed", error);
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };
  const handleChangeText = (text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchUsers(text);
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSearched(false);
  };

  const renderItem = ({ item }: { item: Profile }) => {
    return (
      <TouchableOpacity
        style={searchstyles.resultRow}
        onPress={() => {
          router.navigate({
            pathname: "/screens/userprofile",
            params: { userId: item.id },
          });
        }}
      >
        <Image
          source={{ uri: item.avatar_url }}
          style={searchstyles.resultAvatar}
        />
        <View style={searchstyles.resultTextContainer}>
          <Text style={searchstyles.resultUsername}>{item.username}</Text>
          <Text style={searchstyles.resultFullName}>{item.full_name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={searchstyles.container} edges={["top"]}>
      <View style={searchstyles.header}>
        <View style={searchstyles.searchBar}>
          <Feather name="search" size={18} color="#b5b5b5" />
          <TextInput
            value={query}
            onChangeText={handleChangeText}
            onSubmitEditing={() => searchUsers(query)}
            placeholder="Search"
            placeholderTextColor="#b5b5b5"
            style={searchstyles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Feather name="x" size={18} color="#b5b5b5" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={searchstyles.centered}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 70 }}
          ListEmptyComponent={
            searched ? (
              <View style={searchstyles.centered}>
                <Text style={searchstyles.emptyText}>No users found</Text>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const searchstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "white",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dcdcdc97",
    marginHorizontal: 10,
    marginVertical: 10,
    height: 60,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#000000",
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 8,
  },
  resultAvatar: {
    height: 55,
    width: 55,
    borderRadius: 50,
  },
  resultTextContainer: {
    marginLeft: 10,
  },
  resultUsername: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultFullName: {
    color: "#777777",
    fontSize: 13,
    marginTop: 2,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    color: "#777777",
    fontSize: 15,
  },
});
