# Product Roadmap: Instagram Clone Feature Parity (TODO)

> **Application:** Instagram Clone  
> **Evaluation Date:** September 2026  
> **Framework:** Expo (v57) / React Native (0.86) / Supabase  
> **Status:** 41 Strategic Tasks across 12 Product Areas  

---

## Current Application Baseline

Before identifying missing features, here is what the application already implements:
- **Authentication:** Email & password Sign Up, Sign In, and Session persistence via Supabase Auth.
- **Navigation:** Five-tab root layout (Home Feed, Reels, Messages, Explore/Search, Profile).
- **Home Feed:** Chronological feed of image posts with author username, avatar, location, caption, like toggle, and like count.
- **Post Creation:** Single photo picker from device photo library with caption, location, and upload to Supabase Storage.
- **Stories Bar:** Horizontal story avatar tray in home feed header with single-story creation and full-screen image viewing.
- **User Profile:** Own profile screen with avatar, bio, post count, 3-column post thumbnail grid, and basic profile editor.
- **User Search:** Username search bar with debounce query and navigation to other users' profiles.
- **Direct Messaging:** 1-on-1 chat screen with real-time Supabase postgres change subscriptions, text messaging, and read receipts.
- **Social Graph:** Basic follow/unfollow toggle on peer user profile.
- **Highlights:** Basic highlight circle gallery on user profile with photo viewer.

---

## 1. Feed & Social Interactions

### TASK-FEED-001: Double-Tap Post to Like with Animated Heart Pop
- **Priority:** High
- **Area:** Home Feed
- **What already exists:**
  Single-tap heart icon toggle in `PostItem.tsx` updates like status and count.
- **What is missing:**
  The iconic Instagram gesture: double-tapping anywhere on the post image to instantly like the post, accompanied by an animated heart bursting in the center of the image.
- **What needs to be built:**
  Implement a double-tap gesture handler using `react-native-gesture-handler` (`Gesture.Tap().numberOfTaps(2)`). Add an animated overlay using `react-native-reanimated` that scales a white heart from 0 to 1.2 with spring physics and fades out, triggering `likePost()` and light haptic feedback.
- **Definition of done:**
  Double-tapping any post image toggles like to true, plays the heart burst animation, vibrates subtly, and increments like count without stutter.

---

### TASK-FEED-002: Carousel Multi-Media Posts
- **Priority:** High
- **Area:** Home Feed & Post Creation
- **What already exists:**
  `posts` table and `PostItem.tsx` support only a single `image_url` string.
- **What is missing:**
  Instagram carousel posts allowing users to upload and swipe horizontally through up to 10 images or videos with dot pagination indicators and page counter badges (`1/5`).
- **What needs to be built:**
  1. Add `post_media` table (`id, post_id, media_url, media_type, order_index`) or a JSONB `media` array column in `posts`.
  2. Enable multiple selection in `expo-image-picker` (`allowsMultipleSelection: true`).
  3. Render a horizontal paging `FlatList` or `ScrollView` inside `PostItem.tsx` with an active dot indicator and top-right index badge.
- **Definition of done:**
  Users can upload up to 10 photos/videos in a single post and followers can swipe smoothly through the carousel with accurate dot pagination.

---

### TASK-FEED-003: Inline Video Playback in Home Feed
- **Priority:** High
- **Area:** Home Feed
- **What already exists:**
  `PostItem.tsx` only renders `<ExpoImage>`. `expo-video` is installed in `package.json` but completely unused.
- **What is missing:**
  Video posts playing inline in the home feed. Videos should automatically play when scrolled into the center of the viewport, pause when scrolled out, and include a tap-to-mute/unmute sound toggle.
- **What needs to be built:**
  1. Support video upload in post creation with thumbnail generation.
  2. Implement `useVideoPlayer` from `expo-video` inside `PostItem.tsx` for video posts.
  3. Add a viewport visibility detector using `viewabilityConfig` on the feed `FlatList` to play only the currently visible video item.
  4. Add a global audio mute toggle icon in the lower-right corner of the video.
- **Definition of done:**
  Videos play smoothly inline as the user scrolls the feed, automatically pause when offscreen, and respect the mute/unmute state.

---

### TASK-FEED-004: Post Bookmarking & Saved Collections
- **Priority:** High
- **Area:** Feed & User Profile
- **What already exists:**
  A bookmark icon is rendered in `PostItem.tsx` (line 159), but has no `onPress` handler or state.
- **What is missing:**
  The ability to save posts to a private "Saved" library, toggle bookmarking on/off, organize saved posts into collections, and access saved posts via the profile menu.
- **What needs to be built:**
  1. Create a `saved_posts` table in Supabase (`user_id, post_id, created_at, collection_id`).
  2. Implement bookmark toggle with optimistic UI in `PostItem.tsx`.
  3. Create a "Saved" screen accessible from Settings/Profile showing all bookmarked posts in a 3-column grid.
- **Definition of done:**
  Tapping the bookmark icon fills the icon, saves the post to the database, and displays it in the user's private "Saved" gallery.

---

### TASK-FEED-005: Post Sharing Sheet (DM & Native System Share)
- **Priority:** Medium
- **Area:** Home Feed
- **What already exists:**
  A paper airplane / messenger icon is rendered in `PostItem.tsx` (line 144) without an `onPress` handler.
- **What is missing:**
  A share drawer that lets users quickly send the post to recent direct message contacts or share a link to external apps via the native OS share sheet.
- **What needs to be built:**
  1. Build a bottom sheet modal showing recent DM contacts with a "Send" button.
  2. Include a "Share to..." button triggering React Native's `Share.share({ url, message })`.
  3. Include a "Copy Link" button copying the deep-link URL to the clipboard.
- **Definition of done:**
  Tapping the share icon presents the share sheet; users can send the post directly to a contact in chat or invoke the native OS share dialog.

---

### TASK-FEED-006: Contextual Post Action Sheet
- **Priority:** Medium
- **Area:** Home Feed
- **What already exists:**
  A three-dots icon is rendered in `PostItem.tsx` (line 85) without an `onPress` handler.
- **What is missing:**
  An action sheet providing contextual options based on post ownership:
  - For own posts: Delete Post, Edit Caption, Archive Post, Turn Off Commenting, Copy Link.
  - For others' posts: Unfollow Author, Report, Mute, Not Interested, Copy Link.
- **What needs to be built:**
  Implement a bottom sheet or modal menu bound to the three-dots button. Wire `deletePost(postId)` with confirmation dialog and automatic feed removal.
- **Definition of done:**
  Clicking more-options opens a styled action sheet with functional Delete for post authors and Unfollow/Report for other users.

---

## 2. Stories Experience

### TASK-STRY-001: Animated Story Auto-Advancement & Segmented Progress Bars
- **Priority:** Critical
- **Area:** Stories
- **What already exists:**
  `app/(modals)/story.tsx` displays a single static image without any timer or progression.
- **What is missing:**
  Instagram's signature story playback engine: segmented progress bars at the top corresponding to each story, 5-second automatic progression, touch-and-hold to pause, tap right to skip, and tap left to rewind.
- **What needs to be built:**
  1. Build a segmented progress bar component using `react-native-reanimated` driving a 0-to-1 animation over 5000ms.
  2. Implement touch responders: `onPressIn` pauses animation; `onPressOut` resumes; tap left advances to previous index; tap right advances to next index.
  3. Auto-close when the last story finishes.
- **Definition of done:**
  Stories progress with smooth animated top bars, pause on hold, navigate forward/backward on tap, and close on completion.

---

### TASK-STRY-002: Multi-Story Grouping & User-to-User Swipe Transition
- **Priority:** High
- **Area:** Stories
- **What already exists:**
  `services/stories.ts` returns a flat list of individual stories. Clicking a story opens only that single image.
- **What is missing:**
  Grouping multiple stories by user (e.g., User A has 3 active stories). When viewing User A's last story, advancing seamlessly transitions to User B's first story with Instagram's 3D cube or slide gesture.
- **What needs to be built:**
  1. Refactor `fetchStories` to group stories by `user_id`: `Record<string, { user: Profile, stories: Story[] }>`.
  2. Implement a horizontal pager (`react-native-pager-view` or gesture-driven FlatList) where each page represents a user, and internal navigation progresses through that user's stories.
- **Definition of done:**
  Opening stories starts at the tapped user's first unread story and allows seamless swiping between different users' story queues.

---

### TASK-STRY-003: In-App Camera for Story Capture
- **Priority:** High
- **Area:** Stories & Creation
- **What already exists:**
  `app/screens/addStory.tsx` only opens the device photo library via `ImagePicker.launchImageLibraryAsync`.
- **What is missing:**
  A full-screen in-app camera viewfinder allowing users to take immediate photos (tap shutter) or record videos (press-and-hold shutter) with front/back camera flip and flash controls.
- **What needs to be built:**
  1. Integrate `expo-camera` with full-screen camera preview.
  2. Add capture buttons: tap shutter for photo, hold shutter for video recording up to 15 seconds.
  3. Add flip camera and flash toggle buttons.
  4. Provide a post-capture preview screen with "Your Story" share button.
- **Definition of done:**
  Users can open the story creator, shoot a photo or short video directly using their camera, preview it, and publish it to their story.

---

### TASK-STRY-004: Interactive Story Stickers & Text Overlays
- **Priority:** Medium
- **Area:** Stories
- **What already exists:**
  Raw image upload only.
- **What is missing:**
  Creative overlay tools before publishing a story: text overlay with font styles and colors, mention sticker (`@username`), location tag sticker, and poll sticker.
- **What needs to be built:**
  1. Implement a canvas overlay step on the story preview screen allowing draggable/scalable text elements.
  2. Store overlay metadata in a `stickers` JSON column in `story` table.
  3. Render interactive stickers in `story.tsx` that can be tapped by viewers (e.g. tapping `@username` opens their profile).
- **Definition of done:**
  Users can add styled text and mention stickers to their stories, which remain visible and interactive during story playback.

---

### TASK-STRY-005: 24-Hour Expiration & Story Archiving
- **Priority:** High
- **Area:** Stories
- **What already exists:**
  Stories remain indefinitely in the database and appear in `fetchStories` forever.
- **What is missing:**
  Stories automatically disappearing from the public tray after 24 hours, while being preserved in the author's private Story Archive for creating Highlights.
- **What needs to be built:**
  1. Add `expires_at` column to `story` table defaulting to `created_at + INTERVAL '24 hours'`.
  2. Filter public query with `.gt("expires_at", new Date().toISOString())`.
  3. Create an "Archive" screen in Profile settings where the user can view all their past expired stories.
- **Definition of done:**
  Active story tray only displays stories created within the last 24 hours; expired stories are accessible only to the author in their archive.

---

### TASK-STRY-006: Story Viewers List & Quick Emoji Reactions
- **Priority:** Medium
- **Area:** Stories
- **What already exists:**
  No story viewer tracking or reaction capabilities.
- **What is missing:**
  - For story authors: A swipe-up "Seen by X people" drawer listing users who viewed the story.
  - For story viewers: Quick emoji reaction buttons (😂, 😮, 😍, 😢, 👏, 🔥) and a text reply input that sends the reply directly to the author's DMs.
- **What needs to be built:**
  1. Create a `story_views` table (`story_id, viewer_id, viewed_at`). Record view on mount.
  2. Add bottom reply bar in `story.tsx` with text input and quick emoji bar.
  3. Wire quick reactions to automatically insert a direct message in the author's chat thread.
- **Definition of done:**
  Authors can see who viewed their stories, and viewers can send quick emoji reactions that arrive as direct messages.

---

## 3. Reels & Short-Form Video

### TASK-REEL-001: Full-Screen Vertical Video Reels Feed with `expo-video`
- **Priority:** Critical
- **Area:** Reels
- **What already exists:**
  `app/(tabs)/reel.tsx` renders static image posts inside `ImageBackground`.
- **What is missing:**
  A true vertical short-form video feed with seamless looping, video preloading, instant sound muting/unmuting on screen tap, and immersive edge-to-edge video presentation.
- **What needs to be built:**
  1. Configure `expo-video` player instances for reel items.
  2. Manage active playback based on `FlatList` viewable items (play current, pause adjacent, preload next).
  3. Tap anywhere on video to toggle play/pause or mute with animated speaker/pause overlay icon.
  4. Display audio track name at bottom with scrolling marquee animation.
- **Definition of done:**
  Reels tab plays true vertical video with smooth vertical snapping, looping, and audio controls.

---

### TASK-REEL-002: Reel Creation & Upload Workflow
- **Priority:** High
- **Area:** Reels & Creation
- **What already exists:**
  No way to create or upload reels.
- **What is missing:**
  A dedicated video upload flow for Reels with video file picker, duration trimmer, cover frame thumbnail selector, audio name input, caption, and share to reels feed.
- **What needs to be built:**
  1. Add a Reel creation screen accessible from the Create (+) button.
  2. Enable `mediaTypes: "videos"` in `expo-image-picker`.
  3. Implement video thumbnail extraction using `expo-video-thumbnails` to generate the cover image.
  4. Upload video file to Supabase storage `reels` bucket and insert row into `reels` table.
- **Definition of done:**
  Users can pick a video from their gallery, select a cover thumbnail, enter a caption, and publish it directly to the Reels tab.

---

### TASK-REEL-003: Dedicated Reels Comments Bottom Sheet
- **Priority:** High
- **Area:** Reels
- **What already exists:**
  Comment button on `ReelItem.tsx` has no `onPress` and hardcodes "23" comments.
- **What is missing:**
  An interactive comments bottom sheet overlay that opens on top of the playing reel without interrupting video playback, allowing users to read and post comments while the reel loops in the background.
- **What needs to be built:**
  1. Wire the comment icon to open a `@gorhom/bottom-sheet` modal.
  2. Display reel-specific comments from the database.
  3. Provide an input to post new comments.
- **Definition of done:**
  Tapping the comment icon opens the comments sheet over the playing reel with full read/write capabilities.

---

## 4. Comments & Discussions

### TASK-COMM-001: End-to-End Post Comments Engine
- **Priority:** Critical
- **Area:** Comments
- **What already exists:**
  `app/(modals)/comments.tsx` is an empty stub with `// TODO: fetch comments from supabase`.
- **What is missing:**
  Complete comments backend and UI: database table, fetching comments for a post, posting new comments, timestamp formatting, author avatars, and real-time comment updates.
- **What needs to be built:**
  1. Create `comments` table (`id, post_id, user_id, body, created_at`).
  2. Implement `fetchComments(postId)` in `services/posts.ts` joining `profiles(username, avatar_url)`.
  3. Implement `addComment(postId, userId, text)` in `services/posts.ts`.
  4. Build a fixed bottom input row in `comments.tsx` with user avatar, `TextInput`, and "Post" button.
  5. Subscribe to Supabase real-time INSERT events for the post's comments.
- **Definition of done:**
  Users can read real comments, type and submit new comments, and see comments update immediately.

---

### TASK-COMM-002: Threaded Comment Replies
- **Priority:** Medium
- **Area:** Comments
- **What already exists:**
  No reply structure.
- **What is missing:**
  Tapping "Reply" on a comment populates the input with `@username`, nests the reply under the parent comment, and provides a "View X replies" collapsible accordion.
- **What needs to be built:**
  1. Add `parent_comment_id` (nullable UUID) to `comments` table.
  2. Add a "Reply" button to each comment row.
  3. Implement collapsible reply list beneath parent comments.
- **Definition of done:**
  Users can reply directly to specific comments, creating clear conversation threads.

---

### TASK-COMM-003: Comment Liking & Heart Counter
- **Priority:** Medium
- **Area:** Comments
- **What already exists:**
  No comment liking mechanism.
- **What is missing:**
  A small heart icon on the right side of each comment row allowing users to like comments, showing a like count next to the heart.
- **What needs to be built:**
  1. Create `comment_likes` table (`comment_id, user_id, created_at`).
  2. Implement `likeComment` / `unlikeComment` service functions.
  3. Add heart icon toggle to comment row with optimistic update.
- **Definition of done:**
  Users can like and unlike comments, with live like counts displayed beside each comment.

---

## 5. Explore & Search

### TASK-EXPL-001: Dynamic Staggered Explore Grid Layout
- **Priority:** High
- **Area:** Explore / Search
- **What already exists:**
  `app/(tabs)/search.tsx` renders a uniform 3-column grid of square photos.
- **What is missing:**
  Instagram's distinctive Explore layout: a repeating pattern of 2x2 large featured tiles (reels/videos) alongside four 1x1 standard photo tiles.
- **What needs to be built:**
  1. Implement a custom grid or modular tile layout where every 6-item block contains one 2x2 featured tile and four 1x1 standard tiles.
  2. Display a reel/video badge or play icon on video items.
- **Definition of done:**
  The Explore feed renders an authentic staggered layout mixing large featured tiles with standard square tiles.

---

### TASK-EXPL-002: Categorized Search Filter Tabs
- **Priority:** Medium
- **Area:** Search
- **What already exists:**
  `app/screens/searchUser.tsx` only searches usernames in `profiles`.
- **What is missing:**
  Category tabs beneath the search bar: "Top", "Accounts", "Tags" (Hashtags), "Audio", and "Places".
- **What needs to be built:**
  1. Add a horizontal category tab bar below the search input.
  2. Implement segmented search queries based on active tab: query `profiles` on Accounts, query `hashtags` on Tags.
- **Definition of done:**
  Users can switch search categories to find accounts, hashtags, and locations.

---

### TASK-EXPL-003: Recent Search History with Clear Actions
- **Priority:** Medium
- **Area:** Search
- **What already exists:**
  When search query is empty, `searchUser.tsx` renders a blank screen.
- **What is missing:**
  A list of recent searches displayed before the user types, with an "x" button to remove individual history items and a "Clear all" button.
- **What needs to be built:**
  1. Save clicked search queries or visited profiles to `AsyncStorage` (or Supabase `search_history`).
  2. Display the recent search list on focus when query is empty.
  3. Add individual delete and clear-all handlers.
- **Definition of done:**
  Recently visited profiles appear when opening search and can be managed or cleared.

---

### TASK-EXPL-004: Hashtag Search & Hashtag Feed Screen
- **Priority:** Medium
- **Area:** Search & Feed
- **What already exists:**
  Captions contain raw text. Hashtags are not parsed or indexed.
- **What is missing:**
  Extracting `#hashtags` from post captions, searching hashtags, and a dedicated Hashtag Detail screen showing total post count, "Follow Hashtag" button, and Top/Recent posts grid.
- **What needs to be built:**
  1. Parse hashtags from post captions on creation and populate a `post_hashtags` relationship table.
  2. Create a `/screens/hashtag/[tag]` route displaying hashtag header and 3-column posts grid.
  3. Make hashtags in captions clickable in `PostItem.tsx`.
- **Definition of done:**
  Tapping any `#hashtag` in a caption navigates to that hashtag's dedicated feed.

---

## 6. Direct Messaging (DM)

### TASK-MSG-001: Production Conversation Threads & Unread Badges
- **Priority:** High
- **Area:** Messaging
- **What already exists:**
  `messages.tsx` lists all registered users from the entire database.
- **What is missing:**
  A true conversation inbox displaying only existing message threads, showing unread message count badges, bold text for unread messages, and green online status indicators.
- **What needs to be built:**
  1. Refactor inbox to fetch from `conversations` where `user1_id = me OR user2_id = me`.
  2. Compute unread count per thread (`read_at IS NULL AND sender_id != me`).
  3. Display bold font for unread threads and blue dot indicator.
- **Definition of done:**
  The inbox displays active conversation threads with accurate unread message indicators.

---

### TASK-MSG-002: Rich Media Messaging (Photos, Videos & Voice Notes)
- **Priority:** High
- **Area:** Messaging
- **What already exists:**
  `app/chat/[id].tsx` only sends text strings.
- **What is missing:**
  The ability to send photos, videos, and audio voice messages in chat, with inline image viewing and audio waveforms.
- **What needs to be built:**
  1. Add `media_url` and `media_type` (`text | image | video | audio`) to `messages` table.
  2. Add image picker and camera action buttons inside `chat/[id].tsx` input bar.
  3. Upload chat media to a private Supabase `chat-media` storage bucket.
  4. Render image bubbles with tap-to-expand modal in `chatStyles`.
- **Definition of done:**
  Users can send and view photos and videos directly within their chat conversations.

---

### TASK-MSG-003: Message Emoji Reactions & Unsend Capabilities
- **Priority:** Medium
- **Area:** Messaging
- **What already exists:**
  No message reactions or deletion.
- **What is missing:**
  Double-tapping a message bubble to heart it, long-pressing to select an emoji reaction, and an "Unsend" option for messages sent by the current user.
- **What needs to be built:**
  1. Add a `reactions` JSONB column or `message_reactions` table (`message_id, user_id, emoji`).
  2. Implement double-tap to heart on chat bubbles.
  3. Implement long-press action sheet with emoji picker and "Unsend Message" (deletes row from Supabase).
- **Definition of done:**
  Users can react with emojis to messages and unsend their own messages.

---

### TASK-MSG-004: Audio & Video Calling Entrypoints
- **Priority:** Low
- **Area:** Messaging
- **What already exists:**
  Video camera icon in `messages.tsx` header (line 282) has no `onPress`.
- **What is missing:**
  Call and video call header action buttons in 1-on-1 chat screens leading to an active calling interface (or integration with WebRTC/Agora).
- **What needs to be built:**
  Add call buttons to `chat/[id].tsx` header with confirmation dialog and integration point for video call provider.
- **Definition of done:**
  Calling icons in chat header are wired to initiate calling sessions.

---

## 7. Profiles & Social Graph

### TASK-PROF-001: Real Followers & Following Lists
- **Priority:** High
- **Area:** Profile
- **What already exists:**
  `profile.tsx` and `userProfile.tsx` render hardcoded "59 followers" and "59 following". Tapping the counts does nothing.
- **What is missing:**
  Clickable follower and following counts that open a tabbed modal listing all users who follow or are followed by the user, with an inline search bar and follow/remove action buttons.
- **What needs to be built:**
  1. Query counts dynamically:
     ```ts
     supabase.from("follows").select("*", { count: "exact", head: true })
     ```
  2. Make the counts clickable to navigate to `/screens/userList?type=followers&userId=...`.
  3. Build the user list screen with search bar and Follow/Following toggle button for each row.
- **Definition of done:**
  Tapping followers/following displays the live list of users with functional follow/unfollow actions.

---

### TASK-PROF-002: Direct Message Button on Visited Profiles
- **Priority:** High
- **Area:** Profile
- **What already exists:**
  `userProfile.tsx` only renders a "Follow" button.
- **What is missing:**
  A "Message" button placed side-by-side with the "Follow" button on other users' profiles, allowing immediate navigation to a 1-on-1 chat with that user.
- **What needs to be built:**
  1. Add a "Message" button next to "Follow" in `userProfile.tsx`.
  2. On press, find or create a conversation in `conversations` table between `currentUser.id` and `profile.id`.
  3. Navigate to `/chat/[id]` passing the conversation ID and username.
- **Definition of done:**
  Visiting any user's profile provides a "Message" button that opens an active chat thread with them.

---

### TASK-PROF-003: Tagged Posts (Mentions) Gallery
- **Priority:** Medium
- **Area:** Profile
- **What already exists:**
  Tagged posts tab on profiles renders an empty array `[]`.
- **What is missing:**
  A gallery of posts in which the user was tagged by other users, complete with a tag icon overlay on post thumbnails.
- **What needs to be built:**
  1. Create a `post_tags` table (`post_id, tagged_user_id, x_coord, y_coord`).
  2. Query `post_tags` when `activeTab === "mentions"` on `profile.tsx` and `userProfile.tsx`.
  3. Display the tagged posts grid. If none exist, display a clean empty-state graphic.
- **Definition of done:**
  Switching to the tagged tab displays posts where the user is tagged or an authentic empty-state view.

---

### TASK-PROF-004: Story Highlight Creation & Curation Manager
- **Priority:** Medium
- **Area:** Profile
- **What already exists:**
  `addHighlight.tsx` uploads a single loose image with no title or story selection.
- **What is missing:**
  Instagram's Highlight creation workflow: selecting multiple past stories from the user's Story Archive, entering a highlight title (e.g., "Summer '26"), selecting a cover frame, and saving the collection to the profile.
- **What needs to be built:**
  1. Create `highlights` table (`id, user_id, title, cover_image_url`) and `highlight_stories` junction table (`highlight_id, story_id`).
  2. Build a multi-step modal: step 1 selects stories from archive; step 2 sets title and cover thumbnail.
  3. Display named highlight circles with titles beneath the bio.
- **Definition of done:**
  Users can curate multiple archived stories into a titled Highlight collection that displays on their profile.

---

## 8. Notifications & Activity

### TASK-NOTF-001: Live Notifications Backend & Real-Time Activity Feed
- **Priority:** High
- **Area:** Notifications
- **What already exists:**
  `app/screens/notifications.tsx` is completely hardcoded mock text.
- **What is missing:**
  A dynamic activity feed that displays actual events when someone likes the user's post, comments, follows them, or mentions them in a caption, with timestamp grouping ("Today", "This Week", "This Month") and post thumbnail previews.
- **What needs to be built:**
  1. Create `notifications` table (`id, recipient_id, actor_id, type, post_id, comment_id, created_at, read`).
  2. Add database triggers or service helpers to create notifications on like, comment, and follow events.
  3. Replace mock JSX in `notifications.tsx` with dynamic query grouping events by date.
  4. Make notification rows clickable: tapping a like navigates to the post; tapping a follow navigates to the profile.
- **Definition of done:**
  The notifications screen renders live events generated by real users, with working navigation links.

---

### TASK-NOTF-002: Push Notifications via Expo Notifications
- **Priority:** High
- **Area:** Notifications
- **What already exists:**
  No push notification infrastructure.
- **What is missing:**
  Sending native push notifications to device lockscreens when a user receives a new direct message, like, or follow request while the app is backgrounded.
- **What needs to be built:**
  1. Install `expo-notifications`.
  2. Request notification permissions and register push token in `profiles.push_token`.
  3. Set up a Supabase Edge Function or webhook to dispatch Expo push notifications on new messages or notifications.
- **Definition of done:**
  Users receive push notifications on their devices when receiving messages or interactions while the app is closed.

---

### TASK-NOTF-003: Unread Notification Badges
- **Priority:** Medium
- **Area:** Notifications & Tab Bar
- **What already exists:**
  No notification badges.
- **What is missing:**
  A red dot badge on the Home feed heart icon when new notifications exist, and an unread badge counter on the bottom tab bar.
- **What needs to be built:**
  1. Query unread count (`read = false`) from `notifications` table.
  2. Render a red badge dot on the heart icon in `app/(tabs)/index.tsx`.
- **Definition of done:**
  The notifications icon displays a red badge when unread notifications exist and clears when viewed.

---

## 9. Content Creation & Camera

### TASK-POST-001: Integrated Camera Capture for Posts & Reels
- **Priority:** High
- **Area:** Content Creation
- **What already exists:**
  Post creation (`addPost.tsx`) only opens the gallery photo picker.
- **What is missing:**
  An in-app camera viewfinder tab ("Camera") alongside the photo library picker, allowing users to shoot new photos or videos directly within the post creation flow.
- **What needs to be built:**
  1. Integrate `expo-camera` into the creation modal.
  2. Provide toggle between "Library" and "Photo" / "Video".
  3. Capture photo or video and forward directly into the editing step.
- **Definition of done:**
  Users can capture new photos or videos from within the post creator without leaving the app.

---

### TASK-POST-002: Aspect Ratio Cropping & Image Filter Presets
- **Priority:** High
- **Area:** Content Creation
- **What already exists:**
  `addPost.tsx` uploads whatever raw image dimensions are picked, resulting in arbitrary aspect ratios.
- **What is missing:**
  Instagram's cropping selector allowing users to choose standard aspect ratios (1:1 Square, 4:5 Portrait, 16:9 Landscape), along with photo filter presets (Clarendon, Juno, Ludwig, Valencia, Black & White).
- **What needs to be built:**
  1. Implement an aspect ratio toggle button (1:1, 4:5, Original).
  2. Build a filter preview carousel applying color matrix / shader adjustments to the image before upload.
- **Definition of done:**
  Users can crop photos to standard 1:1 or 4:5 ratios and apply visual filter presets before posting.

---

## 10. Settings & Account Management

### TASK-SETT-001: In-App Theme Selector (System, Light, Dark)
- **Priority:** Medium
- **Area:** Settings
- **What already exists:**
  `ThemeContext.tsx` only inspects system color scheme (`useColorScheme()`). `settings.tsx` has no theme option.
- **What is missing:**
  A Theme option in Settings allowing users to choose: "System Default", "Light Theme", or "Dark Theme", persisted to `AsyncStorage`.
- **What needs to be built:**
  1. Add manual theme override state (`system | light | dark`) to `ThemeContext`.
  2. Persist selection to storage.
  3. Add a "Dark mode" selection row with radio buttons in `app/screens/settings.tsx`.
- **Definition of done:**
  Users can manually toggle between Light Mode, Dark Mode, and System Default from the Settings screen.

---

### TASK-SETT-002: Account Privacy & Follow Request Approval Workflow
- **Priority:** Medium
- **Area:** Settings & Social Graph
- **What already exists:**
  `isPrivate` switch in `settings.tsx` only updates local React state and is never saved.
- **What is missing:**
  Persisting account privacy (`is_private: boolean`). When an account is private:
  - Non-followers visiting the profile see "This Account is Private" and cannot view posts.
  - Tapping "Follow" sends a "Requested" status rather than following immediately.
  - The private account holder receives a follow request notification with "Confirm" and "Delete" buttons.
- **What needs to be built:**
  1. Add `is_private` boolean to `profiles` table.
  2. Add `status` (`pending | accepted`) to `follows` table.
  3. Hide posts grid on `userProfile.tsx` if target user is private and status is not `accepted`.
  4. Build a "Follow Requests" section in Notifications.
- **Definition of done:**
  Private accounts require explicit approval before followers can view their posts or stories.

---

### TASK-SETT-003: Blocked Users Management
- **Priority:** Medium
- **Area:** Settings & Privacy
- **What already exists:**
  "Blocked user" row in `settings.tsx` is an empty stub.
- **What is missing:**
  A dedicated Blocked Users screen listing all blocked accounts with an "Unblock" button, and a "Block" option in profile menus that hides posts and prevents messaging.
- **What needs to be built:**
  1. Create `blocks` table (`blocker_id, blocked_id, created_at`).
  2. Add Block action to profile action sheet.
  3. Build `/screens/blockedUsers` screen listing blocked accounts with unblock action.
- **Definition of done:**
  Users can block and unblock other accounts, preventing blocked users from seeing profile data or sending messages.

---

### TASK-SETT-004: Password Change & Account Security
- **Priority:** Medium
- **Area:** Settings & Security
- **What already exists:**
  No way to change password or manage credentials.
- **What is missing:**
  A "Security" screen in settings allowing authenticated users to change their password via `supabase.auth.updateUser({ password: newPassword })`.
- **What needs to be built:**
  Build a Security settings screen with Current Password, New Password, and Confirm New Password inputs with validation.
- **Definition of done:**
  Users can update their account password from within the app.

---

## 11. Media Optimization & Performance

### TASK-MEDIA-001: Image Pre-Upload Compression & Progressive Thumbnails
- **Priority:** High
- **Area:** Performance & Media
- **What already exists:**
  Full-size multi-megabyte images are uploaded directly from camera roll, resulting in slow feed loading and excessive storage consumption.
- **What is missing:**
  Client-side image compression and resizing before upload, paired with low-resolution blur placeholders during network load.
- **What needs to be built:**
  1. Use `expo-image-manipulator` to resize images to a maximum width of 1080px and compress JPEG quality to 0.8 before uploading.
  2. Use `expo-image` blurhash placeholders for instant visual feedback while images load over the network.
- **Definition of done:**
  Images are compressed under 500KB before upload and display progressive placeholders during feed rendering.

---

## 12. Micro-Interactions & Haptics

### TASK-UX-001: Haptic Feedback Integration Across Key Interactions
- **Priority:** Medium
- **Area:** User Experience
- **What already exists:**
  `expo-haptics` is installed in `package.json` (`~57.0.1`) but is never called.
- **What is missing:**
  Subtle tactile vibrations that give modern mobile apps a polished feel:
  - `Haptics.impactAsync(ImpactFeedbackStyle.Medium)` on post like and double-tap.
  - `Haptics.selectionAsync()` on bottom tab switching and story skipping.
  - `Haptics.notificationAsync(NotificationFeedbackType.Success)` on successful post creation and bookmarking.
- **What needs to be built:**
  Wrap key interaction callbacks with corresponding `expo-haptics` triggers.
- **Definition of done:**
  Liking, tab switching, bookmarking, and posting trigger appropriate native haptic feedback.
