import { API, APIpic } from "@/services/api";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ApiUser = {
  id: number;
  firstName: string;
  image: string;
  address: { city: string };
};
type PicsumImage = {
  id: string;
  author: string;
  download_url: string;
};
export default function Searchuser() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [images, setImages] = useState<PicsumImage[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await API.get("/users");
      const imageResponse = await APIpic.get(`/v2/list?page=13`);
      setImages(imageResponse.data);
      setUsers(response.data.users);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.firstName.toLowerCase().includes(search.toLowerCase()),
  );
  const renderUserItem = ({
    item,
    index,
  }: {
    item: ApiUser;
    index: number;
  }) => (
    <TouchableOpacity style={searchStyle.userRow}>
      <Image
        source={{ uri: images[index].download_url }}
        style={searchStyle.profileImg}
      />

      <View>
        <Text style={searchStyle.username}>{item.firstName}</Text>

        <Text style={searchStyle.location}>{item.address.city}</Text>
      </View>
    </TouchableOpacity>
  );
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
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUserItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={searchStyle.emptyText}>No users found.</Text>
        }
      />
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
