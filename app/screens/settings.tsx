import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "@/services/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
type SettingsOption = {
  icon: string;
  label: string;
  onPress: () => void;
};

const SettingsOptions = ({ icon, label, onPress }: SettingsOption) => {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.rowLeft}>
        <Feather
          name={icon as any}
          size={22}
          color="#262626"
          style={styles.icon}
        />
        <Text style={styles.rowLabel}> {label} </Text>
      </View>
      <Feather name="chevron-right" size={16} color="#bbb" />
    </TouchableOpacity>
  );
};

export default function Settings() {
  const [isPrivate, setIsPrivate] = React.useState(false);
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>Account Settings</Text>
        <View style={styles.cardGroup}>
          <SettingsOptions
            icon="bell"
            label="Notifications"
            onPress={() => {}}
          />
          <SettingsOptions icon="user" label="Account" onPress={() => {}} />
        </View>
        <Text style={styles.sectionHeader}>Privacy & Visibility</Text>
        <View style={styles.cardGroup}>
          <TouchableOpacity style={[styles.row, {}]}>
            <View style={styles.rowLeft}>
              <Feather
                name="lock"
                size={22}
                color="#262626"
                style={styles.icon}
              />
              <Text style={styles.rowLabel}>Private account </Text>
            </View>
            <Switch value={isPrivate} onValueChange={setIsPrivate} />
          </TouchableOpacity>
          <SettingsOptions
            icon="user-x"
            label="Blocked user"
            onPress={() => {}}
          />
        </View>

        <Text style={styles.sectionHeader}>Session</Text>
        <View style={styles.cardGroup}>
          <TouchableOpacity style={styles.row} onPress={handleLogout}>
            <View style={styles.rowLeft}>
              <Feather
                name="log-out"
                size={22}
                color="#ff3b30"
                style={styles.icon}
              />
              <Text
                style={[
                  styles.rowLabel,
                  { color: "#ff3b30", fontWeight: "600" },
                ]}
              >
                Log Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#262626" },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "600",
    color: "#737373",
    marginLeft: 16,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardGroup: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#f5f5f5",
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    height: 50,
    paddingHorizontal: 16,
  },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  icon: { width: 28 },
  rowLabel: { fontSize: 14, color: "#262626" },
});
