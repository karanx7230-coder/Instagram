import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <LinearGradient
      colors={["#833ab4", "#e1306c", "#fcb045"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Image
        source={require("../assets/images/logo.png")}
        resizeMode="contain"
      />
      <Text style={styles.instaText}>Instagram</Text>

      <View style={styles.metaContainer}>
        <Image
          source={require("../assets/images/meta.png")}
          resizeMode="contain"
          style={styles.metaLogo}
        />
        <Text style={styles.metaText}>Meta</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  instaText: {
    color: "black",
    margin: 20,
    fontSize: 17,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    top: "20%",
  },
  metaLogo: {
    height: 20,
    width: 20,
    marginHorizontal: 10,
  },
  metaText: {
    color: "black",
    fontSize: 16,
  },
});
