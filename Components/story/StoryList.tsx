import { useTheme } from "@/context/ThemeContext";
import type { Story } from "@/types/story";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

type StoryListProps = {
  stories: Story[];
  userAvatarUrl: string;
  onAddStory: () => void;
  onOpenStory: (story: Story) => void;
};

export function StoryList({
  stories,
  userAvatarUrl,
  onAddStory,
  onOpenStory,
}: StoryListProps) {
  const { theme } = useTheme();

  const renderStoryItem = useCallback(
    ({ item }: { item: Story }) => (
      <Pressable
        onPress={() => onOpenStory(item)}
        style={styles.storyContainer}
        accessibilityRole="button"
        accessibilityLabel={`View story by ${item.username}`}
      >
        <LinearGradient
          colors={["#833ab4", "#e1306c", "#fcb045"]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <ExpoImage
            source={{ uri: item.profileImage }}
            style={styles.storyimg}
            contentFit="cover"
            cachePolicy="memory-disk"
            accessibilityIgnoresInvertColors
          />
        </LinearGradient>
        <Text style={[styles.usernameText, { color: theme.muted }]} numberOfLines={1}>
          {item.username}
        </Text>
      </Pressable>
    ),
    [onOpenStory, theme.muted],
  );

  return (
    <FlatList
      ListHeaderComponent={
        <Pressable
          style={styles.storyContainer}
          onPress={onAddStory}
          accessibilityRole="button"
          accessibilityLabel="Add to your story"
        >
          <View style={{ marginTop: 5 }}>
            <ExpoImage
              source={userAvatarUrl ? { uri: userAvatarUrl } : undefined}
              style={styles.storyimg}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
            <View style={styles.plusIcon}>
              <Feather name="plus" size={12} color="white" />
            </View>
          </View>
          <Text style={[styles.usernameText, { color: theme.muted }]} numberOfLines={1}>
            your story
          </Text>
        </Pressable>
      }
      data={stories}
      keyExtractor={(item) => item.id}
      renderItem={renderStoryItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      initialNumToRender={7}
      maxToRenderPerBatch={7}
      windowSize={5}
      removeClippedSubviews
    />
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 5,
  },
  storyContainer: {
    marginLeft: 6,
    alignItems: "center",
    width: 86,
  },
  storyimg: {
    height: 80,
    width: 80,
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "#e9e9e9",
    borderRadius: 40,
  },
  usernameText: {
    fontSize: 12,
  },
  gradient: {
    height: 86,
    width: 86,
    borderRadius: 45,
    padding: 3,
  },
  plusIcon: {
    height: 22,
    width: 22,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: 0,
    right: 0,
    backgroundColor: "#000000",
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "white",
  },
});
