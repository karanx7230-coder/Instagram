import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Searchuser() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const fetchUsers = async () => {
    setLoading(true);
    try {
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

 
    
  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={searchStyle.container}>
      <View>
        <TextInput
          style={searchStyle.searchInput}
          autoFocus
          placeholder="Search by name..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      
    </SafeAreaView>
  );
}

const searchStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  searchInput: {
    height: 40,
    margin: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#fafafa",
  },
  profileImg: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: "#ddd",
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
  },
  location: {
    fontSize: 13,
    color: "gray",
    marginTop: 2,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "gray",
    fontSize: 16,
  },
});
