# Technical Audit: Confirmed Codebase Issues (FIX-ME)

> **Repository:** `C:\Projects\Instagram`  
> **Audit Date:** September 2026  
> **Target Framework:** Expo (v57) / React Native (0.86) / Supabase  
> **Status:** 49 Confirmed Issues across 17 Functional Areas  

---

## Executive Summary

A comprehensive technical audit of the codebase was conducted by directly inspecting all components, screens, hooks, services, configurations, and navigation structures. The project exhibits significant architectural fragmentation: core features (comments, notifications, video reels) are either completely non-functional mock UI or empty stubs; critical navigation flows trap users on screens due to missing back/dismiss controls; several detail views query the global feed rather than target resources; and the majority of screens hardcode light mode colors despite the presence of a ThemeContext.

---

## 1. Authentication, Startup & Bootstrap

### ISS-AUTH-001: Unconditional 2-Second Timeout in Startup Route Forces Redirection to Login
- **Priority:** Critical
- **Exact Path:** `app/index.tsx`
- **Component / Function:** `Index` (`useEffect` on lines 7–12)
- **What is wrong:**
  ```tsx
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/login");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  ```
  `app/index.tsx` mounts on launch and fires an unconditional timer that redirects the user to `/(auth)/login` after 2000ms, completely ignoring whether the user already has a valid active session.
- **Why it is a problem:**
  When an authenticated user opens the app, `app/_layout.tsx` detects the session and navigates to `/(tabs)`. However, if the splash route executes its timer, it replaces the active route with `/(auth)/login`. `_layout.tsx` then has to react again to route back to `/(tabs)`, causing an erratic UI flicker, screen flash, and race conditions during bootstrap.
- **What should be changed:**
  Remove the arbitrary 2-second timeout. Let `app/_layout.tsx` handle authentication-based routing deterministically using `supabase.auth.getSession()` and `SplashScreen.hideAsync()` from `expo-splash-screen`.
- **Definition of done:**
  Authenticated users land directly on `/(tabs)` without being routed through `/(auth)/login`. Unauthenticated users land cleanly on `/(auth)/login`.

---

### ISS-AUTH-002: Incomplete Signup Workflow with Unconfirmed Email and Orphaned Profiles
- **Priority:** High
- **Exact Path:** `app/(auth)/signup.tsx`
- **Component / Function:** `Signup` (`handleSignUp` lines 65–84)
- **What is wrong:**
  ```tsx
  const { data, error } = await signUpWithEmail(email.trim(), password);
  if (error) { setServerError(error.message); return; }
  if (data.user) {
    const { error: profileError } = await createProfile(data.user.id, username.trim());
    if (profileError) { setServerError(profileError.message); return; }
  }
  router.replace("/(tabs)");
  ```
  If Supabase has email confirmations enabled, `signUpWithEmail` succeeds but creates an unconfirmed session (`session === null`). The code proceeds directly to `router.replace("/(tabs)")`, where `_layout.tsx` immediately rejects the unauthenticated route and pushes the user back to login with no explanatory feedback. Moreover, if `createProfile` fails after `signUpWithEmail` succeeds, the auth user is created without a corresponding database row in `profiles`, permanently bricking that email address from creating a profile.
- **Why it is a problem:**
  New users signing up either get bounced back to login with zero guidance about verifying email or are left with corrupted half-created accounts.
- **What should be changed:**
  Check `data.session`. If null, display a confirmation screen advising the user to check their email. Wrap profile insertion with robust error handling, or use a Supabase database trigger on `auth.users` to automatically create the profile row atomically in PostgreSQL.
- **Definition of done:**
  Account registration handles both confirmed and confirmation-required flows, providing clear messaging to the user, and profiles are created reliably without orphaned auth records.

---

### ISS-AUTH-003: Redundant "Forget password?" Button on Account Creation Screen
- **Priority:** Low
- **Exact Path:** `app/(auth)/signup.tsx`
- **Component / Function:** `Signup` (lines 207–209)
- **What is wrong:**
  ```tsx
  <Pressable>
    <Text style={Loginstyle.forget}>Forget password?</Text>
  </Pressable>
  ```
  A "Forget password?" button is rendered on the Sign Up screen.
- **Why it is a problem:**
  A user creating a new account has no forgotten password. This is a dead copy-paste element copied from `login.tsx`.
- **What should be changed:**
  Remove the `Forget password?` component from `signup.tsx`.
- **Definition of done:**
  The signup screen contains only fields relevant to registration (Username, Email, Password, Create Account, Sign In link).

---

### ISS-AUTH-004: Non-Functional "Forget password?" Button on Login Screen
- **Priority:** High
- **Exact Path:** `app/(auth)/login.tsx`
- **Component / Function:** `Login` (lines 144–146)
- **What is wrong:**
  ```tsx
  <Pressable>
    <Text style={Loginstyle.forget}>Forget password?</Text>
  </Pressable>
  ```
  The button has no `onPress` handler attached.
- **Why it is a problem:**
  Users who forget their password have no recovery path and are permanently locked out of their accounts.
- **What should be changed:**
  Implement a password recovery modal or screen invoking `supabase.auth.resetPasswordForEmail(email)`.
- **Definition of done:**
  Clicking "Forget password?" prompts the user for their email and initiates the Supabase password recovery flow with appropriate UI feedback.

---

## 2. Security & Supabase Configuration

### ISS-SEC-001: Cleartext Auth Token Storage in AsyncStorage Instead of SecureStore
- **Priority:** Critical
- **Exact Path:** `services/supabase.ts`
- **Component / Function:** `createClient` configuration (lines 7–14)
- **What is wrong:**
  ```tsx
  import AsyncStorage from "@react-native-async-storage/async-storage";
  ...
  export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  ```
  `expo-secure-store` is installed in `package.json` (`~57.0.1`) and registered in `app.json` plugins, yet Supabase is configured with `@react-native-async-storage/async-storage`.
- **Why it is a problem:**
  On Android and iOS, `AsyncStorage` stores data unencrypted in SQLite or XML files. On rooted or jailbroken devices, or via backup extraction, Supabase JWT access and refresh tokens can be extracted in plaintext by malicious actors or secondary apps.
- **What should be changed:**
  Implement a custom storage adapter leveraging `expo-secure-store` with chunking or fallback for values exceeding 2048 bytes, or use an audited SecureStore adapter.
- **Definition of done:**
  Supabase session tokens are securely encrypted using native keychain/keystore APIs via `expo-secure-store`.

---

### ISS-SEC-002: Unvalidated Supabase Client Environment Variables
- **Priority:** Medium
- **Exact Path:** `services/supabase.ts`
- **Component / Function:** lines 4–5
- **What is wrong:**
  ```tsx
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
  ```
- **Why it is a problem:**
  If the `.env` file is missing, empty, or misspelled in a new environment or CI pipeline, non-null assertions `!` bypass TypeScript compilation. The app subsequently fails at runtime with cryptic URL construction errors rather than a descriptive diagnostic.
- **What should be changed:**
  Add a validation guard:
  ```ts
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY in environment configuration.");
  }
  ```
- **Definition of done:**
  The app throws an explicit, actionable error if Supabase credentials are missing at bootstrap.

---

## 3. Architecture & Build Configuration

### ISS-ARCH-001: Chat Route `chat/[id]` Omitted from Root Stack Definition
- **Priority:** High
- **Exact Path:** `app/_layout.tsx`
- **Component / Function:** `RootLayout` (`<Stack>` on lines 51–66)
- **What is wrong:**
  ```tsx
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="index" />
    <Stack.Screen name="(auth)" />
    <Stack.Screen name="(tabs)" />
    <Stack.Screen name="screens" options={{ animation: "slide_from_right" }} />
    <Stack.Screen name="(modals)" options={{ presentation: "transparentModal" }} />
  </Stack>
  ```
  `app/chat/[id].tsx` is placed directly at `app/chat/[id].tsx`, outside `screens`, `(tabs)`, or `(modals)`, but is not declared in `<Stack>`.
- **Why it is a problem:**
  While Expo Router auto-discovers routes, undeclared screens inherit default stack settings without explicit transition animations, header controls, or lifecycle management, leading to inconsistent platform transitions.
- **What should be changed:**
  Explicitly register `<Stack.Screen name="chat/[id]" options={{ headerShown: false, animation: "slide_from_right" }} />` or relocate `chat/[id]` into `app/screens/chat/[id].tsx`.
- **Definition of done:**
  The chat screen is explicitly declared in navigation configuration with consistent animation and presentation options.

---

### ISS-ARCH-002: Duplicate Competing Auth State Listeners in Layout and Context
- **Priority:** Medium
- **Exact Path:** `app/_layout.tsx` (lines 22–26) and `context/UserContext.tsx` (lines 72–83)
- **What is wrong:**
  Both `RootLayout` and `UserProvider` establish independent subscriptions to `supabase.auth.onAuthStateChange`. Both independently listen to auth events, trigger state updates, and independently request user/session data.
- **Why it is a problem:**
  Redundant event loops and network requests occur on login, token refresh, and logout. State synchronization timing differences can produce race conditions during route redirects.
- **What should be changed:**
  Centralize session and auth listener management within `UserContext`, exposing `session`, `user`, and `loading`, while `_layout.tsx` simply consumes `useUser()`.
- **Definition of done:**
  A single `onAuthStateChange` listener manages authentication state throughout the app.

---

### ISS-BUILD-001: Dead Script `reset-project` Referencing Non-Existent File
- **Priority:** Low
- **Exact Path:** `package.json`
- **Component / Function:** Line 7 (`"reset-project": "node ./scripts/reset-project.js"`)
- **What is wrong:**
  The `scripts/` directory does not exist in the repository.
- **Why it is a problem:**
  Executing `npm run reset-project` crashes with `Error: Cannot find module './scripts/reset-project.js'`.
- **What should be changed:**
  Remove the script entry or provide the corresponding script file.
- **Definition of done:**
  All scripts declared in `package.json` point to existing files.

---

### ISS-BUILD-002: Conflicting Dual Package Lockfiles (`package-lock.json` and `yarn.lock`)
- **Priority:** Low
- **Exact Path:** Project Root (`package-lock.json` and `yarn.lock`)
- **What is wrong:**
  Both `package-lock.json` (462 KB) and `yarn.lock` (313 KB) are committed to version control.
- **Why it is a problem:**
  Different package managers resolve sub-dependencies with slight version variations. Having both lockfiles causes non-reproducible builds across machines, CI failures, and confusion over package manager choice.
- **What should be changed:**
  Adopt a single package manager (npm or yarn), standardize in documentation, and delete the unused lockfile.
- **Definition of done:**
  Exactly one lockfile exists in the project root matching the project's chosen package manager.

---

### ISS-BUILD-003: 32.5MB Binary File `bundletool.jar` Committed to Repository Root
- **Priority:** Low
- **Exact Path:** `bundletool.jar` (Project Root)
- **What is wrong:**
  A 32,505,571 byte binary executable (`bundletool.jar`) is tracked in Git. It is not ignored by `.gitignore`.
- **Why it is a problem:**
  Bloats repository download size, pollutes git history, and introduces an unverified binary into source control.
- **What should be changed:**
  Remove `bundletool.jar` from git tracking and add `*.jar` to `.gitignore`. If required for local bundle building, document download via script.
- **Definition of done:**
  No `.jar` binaries exist in git tracking and `.gitignore` ignores `*.jar`.

---

## 4. Navigation & UX Traps

### ISS-NAV-001: Menu Button on Another User's Profile Opens Logged-in User's Settings
- **Priority:** Critical
- **Exact Path:** `components/common/NavButton.tsx` (lines 22–37) invoked in `app/screens/userProfile.tsx` (line 183)
- **What is wrong:**
  ```tsx
  export const Menu = () => {
    return (
      <Pressable onPress={() => router.push("/screens/settings")} ...>
        <Feather name="menu" size={25} color="black" />
      </Pressable>
    );
  };
  ```
  `app/screens/userProfile.tsx` is the screen for viewing *other* users' profiles. In its header, it invokes `<Menu />`.
- **Why it is a problem:**
  Tapping the menu button while viewing someone else's profile unexpectedly navigates to your personal application Settings screen (`/screens/settings`) rather than showing an Instagram-style profile action sheet (Report, Block, Copy Profile URL, Share Profile).
- **What should be changed:**
  Make `<Menu />` accept an `onPress` callback prop or replace it in `userProfile.tsx` with an options sheet component designed for other users' profiles.
- **Definition of done:**
  Clicking the menu button on a peer user's profile opens an action sheet with user-specific actions (Block, Report, Share) and never navigates to personal settings.

---

### ISS-NAV-002: Inappropriate Back Button on Root Profile Tab
- **Priority:** Medium
- **Exact Path:** `app/(tabs)/profile.tsx` (line 103)
- **Component / Function:** `Profile` (`<Back />` inside `topNav`)
- **What is wrong:**
  ```tsx
  <View style={profilestyles.topNav}>
    <Back />
    <Text ...>{user.username}</Text>
    <Menu />
  </View>
  ```
  `<Back />` (`router.back()`) is placed in the header of the root Profile tab.
- **Why it is a problem:**
  Profile is a top-level bottom tab screen. Root tabs do not have parent screens in the stack. Tapping Back either has no effect or causes unexpected jumping to whichever tab was previously visited.
- **What should be changed:**
  Remove `<Back />` from `app/(tabs)/profile.tsx`. Replace with standard Instagram header elements (Lock icon / Account Switcher).
- **Definition of done:**
  The bottom tab Profile screen has no back arrow in its top navigation bar.

---

### ISS-NAV-003: Widespread Missing Back Buttons Trapping Users on Stack Screens
- **Priority:** High
- **Exact Path:**
  - `app/screens/posts.tsx`
  - `app/screens/searchpost.tsx`
  - `app/screens/notifications.tsx`
  - `app/screens/settings.tsx`
  - `app/screens/searchUser.tsx`
  - `app/screens/addPost.tsx`
  - `app/screens/addStory.tsx`
  - `app/screens/addHighlight.tsx`
  - `app/(modals)/story.tsx`
  - `app/screens/highlight.tsx`
- **What is wrong:**
  In `app/screens/_layout.tsx`, `screenOptions={{ headerShown: false }}` hides native headers. The screens listed above fail to render custom back buttons (`<Back />` or `router.back()`) or close buttons.
- **Why it is a problem:**
  On iOS devices (and Android devices with gesture navigation disabled), users who navigate into these screens have no UI control to dismiss or exit them. They are trapped and forced to restart the app.
- **What should be changed:**
  Add a consistent top navigation header with a Back or Close button to every screen in `app/screens/` and modals.
- **Definition of done:**
  Every secondary and modal screen includes a reachable, accessible button that calls `router.back()`.

---

### ISS-NAV-004: Untinted Raster PNG Tab Icons Invisible in Dark Theme
- **Priority:** Medium
- **Exact Path:** `app/(tabs)/_layout.tsx` (lines 28–70)
- **What is wrong:**
  ```tsx
  <Image
    source={require("../../assets/images/Home.png")}
    style={[style.img, { opacity: focused ? 1 : 0.8 }]}
  />
  ```
  The tab icons (`Home.png`, `reel.png`, `Messanger.png`, `Search.png`) are raster images rendered without `tintColor: theme.text`.
- **Why it is a problem:**
  The tab bar in dark mode has background `#000000`. Black raster icons on a black background disappear completely, leaving an empty bottom bar.
- **What should be changed:**
  Add `tintColor: theme.text` to tab icon styles, or replace raster PNGs with vector icons from `@expo/vector-icons` (e.g. `Ionicons` or `Feather`).
- **Definition of done:**
  Tab icons are clearly visible and appropriately tinted in both light and dark color schemes.

---

### ISS-NAV-005: Hardcoded Black Colors in Shared NavButton Component
- **Priority:** Medium
- **Exact Path:** `components/common/NavButton.tsx` (lines 18 and 35)
- **What is wrong:**
  ```tsx
  <Feather name="arrow-left" size={24} color="black" />
  <Feather name="menu" size={25} color="black" />
  ```
- **Why it is a problem:**
  `NavButton.tsx` hardcodes `color="black"`. When used on dark backgrounds (e.g., dark theme profile), the icons blend into the background and become invisible.
- **What should be changed:**
  Consume `useTheme()` inside `NavButton.tsx` and pass `color={theme.text}`.
- **Definition of done:**
  Nav buttons adapt dynamically to the active theme color scheme.

---

## 5. Feed, Posts & Post Details

### ISS-FEED-001: Unbounded Like History Fetch on Every Feed Mount
- **Priority:** High
- **Exact Path:** `services/posts.ts` (lines 24–33) and `app/(tabs)/index.tsx` (lines 44–48)
- **What is wrong:**
  ```tsx
  export async function fetchLikedPostIds(userId: string): Promise<Set<string>> {
    const { data, error } = await supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", userId);
    if (error) throw error;
    return new Set((data ?? []).map((l) => l.post_id as string));
  }
  ```
  `app/(tabs)/index.tsx` calls `fetchLikedPostIds(userId)` on initial load.
- **Why it is a problem:**
  This queries every like ever recorded for the user across the history of the app without limit or pagination. For an active user with 5,000 likes, 5,000 rows are transferred, parsed, and converted to a Set on every app boot, wasting bandwidth and battery.
- **What should be changed:**
  Filter likes by the post IDs currently loaded:
  ```ts
  .in("post_id", postIds)
  ```
  or include a user-specific `is_liked` boolean via a Supabase PostgREST view or RPC.
- **Definition of done:**
  Like statuses are fetched only for the batch of posts currently displayed in the feed.

---

### ISS-FEED-002: Missing Pull-to-Refresh on Main Home Feed
- **Priority:** Medium
- **Exact Path:** `app/(tabs)/index.tsx` (lines 177–203)
- **What is wrong:**
  The `FlatList` in `Index` does not supply `onRefresh` or `refreshing` props.
- **Why it is a problem:**
  Pull-to-refresh is the universal expected gesture to check for new posts on Instagram. Users cannot manually trigger a feed reload without restarting the app.
- **What should be changed:**
  Add a `refreshing` state and wire `onRefresh={loadInitial}` with `RefreshControl`.
- **Definition of done:**
  Pulling down on the feed triggers a refresh indicator, reloads the first page of posts and stories, and updates the list.

---

### ISS-FEED-003: Interactive Post Header & Footer Buttons are Dead Mock UI
- **Priority:** Medium
- **Exact Path:** `components/post/PostItem.tsx`
- **What is wrong:**
  - Author Avatar & Username (lines 60–71): Wrapped in `TouchableOpacity` without an `onPress` prop. Does not navigate to the author's profile.
  - Follow Button (lines 74–80): Wrapped in `TouchableOpacity` without an `onPress` prop. Does not follow/unfollow the author.
  - More Options (lines 81–91): Wrapped in `TouchableOpacity` without an `onPress` prop.
  - Share/Messenger Icon (lines 144–153): No `onPress` prop.
  - Bookmark/Save Icon (lines 155–160): No `onPress` prop.
- **Why it is a problem:**
  Users tapping the author's name or avatar expect to open their profile. Users tapping follow or save expect the action to execute.
- **What should be changed:**
  Wire `profileContainer` to `router.push({ pathname: "/screens/userProfile", params: { userId: ... } })`, implement bookmark toggling, follow toggling, and options bottom sheet.
- **Definition of done:**
  Tapping the author navigates to their profile, tapping follow updates the follow relationship, and tapping save persists the post to bookmarks.

---

### ISS-FEED-004: Semantic Parameter Bug Passing `postId` as `userId`
- **Priority:** Low
- **Exact Path:** `components/post/PostItem.tsx` (line 131) vs `app/(modals)/comments.tsx` (line 15)
- **What is wrong:**
  ```tsx
  // PostItem.tsx:
  router.navigate({
    pathname: "/(modals)/comments",
    params: { userId: postId },
  });

  // comments.tsx:
  const { userId } = useLocalSearchParams();
  ```
  `PostItem` passes a parameter named `userId`, but assigns `postId` as its value.
- **Why it is a problem:**
  Severely confusing and error-prone. Any developer writing comment-fetching logic expects `postId` to be the ID of the post, but reading `userId` causes incorrect query filters and broken comment relations.
- **What should be changed:**
  Pass `params: { postId }` and consume `const { postId } = useLocalSearchParams<{ postId: string }>()`.
- **Definition of done:**
  Comments screen receives and consumes a parameter named `postId`.

---

### ISS-POST-001: Profile Post Grid Detail Screen Ignores User ID and Loads Global Feed
- **Priority:** Critical
- **Exact Path:** `app/screens/posts.tsx` (lines 35–49)
- **Component / Function:** `Posts` (`loadInitial`)
- **What is wrong:**
  When a user taps a post thumbnail in their profile grid (`profile.tsx`), it navigates to `/screens/posts` passing `{ userId, postId }`. However, `app/screens/posts.tsx` calls:
  ```tsx
  const [feed, liked] = await Promise.all([
    fetchFeedPosts({ page: 0, pageSize: config.feedPageSize }),
    ...
  ]);
  ```
  It queries the **global feed**, completely ignoring `userId`. It then tries to find `postId` in the first 8 posts of the global feed (`ordered.findIndex((p) => p.id === postId)`).
- **Why it is a problem:**
  If the post tapped in the user's profile is not among the top 8 posts of the entire platform's global feed, `targetIndex` is -1 and the tapped post is not even displayed! The screen just displays 8 random global feed posts instead of the user's posts.
- **What should be changed:**
  Query posts by `user_id`:
  ```ts
  supabase.from("posts").select(POST_SELECT).eq("user_id", userId).order("created_at", { ascending: false });
  ```
- **Definition of done:**
  Opening a post from a profile grid displays that user's posts, scrolled to the selected post.

---

### ISS-POST-002: Explore Grid Detail Screen Ignores `postId` and Shows Global Feed
- **Priority:** Critical
- **Exact Path:** `app/screens/searchpost.tsx` (lines 13–46)
- **Component / Function:** `SearchPosts`
- **What is wrong:**
  When a user taps a photo in the Explore grid (`app/(tabs)/search.tsx`), it navigates to `/screens/searchpost` passing `params: { postId: item.id }`. But `searchpost.tsx`:
  1. Does not even invoke `useLocalSearchParams()`.
  2. Unconditionally calls `fetchFeedPosts({ page: 0, pageSize: config.feedPageSize })`.
- **Why it is a problem:**
  Tapping any photo in Explore completely fails to open that photo. It simply re-renders page 0 of the home feed.
- **What should be changed:**
  Read `postId` from search params, query that specific post (and surrounding explore recommendations), and display the selected post.
- **Definition of done:**
  Tapping any photo in Explore opens a detail view displaying that exact post.

---

## 6. Comments System

### ISS-COMM-001: Comments Feature is an Unimplemented Stub
- **Priority:** Critical
- **Exact Path:** `app/(modals)/comments.tsx` (lines 20–31)
- **Component / Function:** `Comments` (`fetchComments`)
- **What is wrong:**
  ```tsx
  useEffect(() => {
    const fetchComments = async () => {
      try {
        // TODO: fetch comments from supabase
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [userId]);
  ```
  `comments` state is initialized to `[]` and never set. Furthermore, there is no text input, no submit button, and no service function to create or post comments.
- **Why it is a problem:**
  Comments are a cornerstone of Instagram social interactions. Currently, opening comments displays a blank sheet with "No comments yet" and no way to write or read comments.
- **What should be changed:**
  1. Create a `comments` table in Supabase (`id, post_id, user_id, body, created_at`).
  2. Implement `fetchComments(postId)` in `services/posts.ts`.
  3. Implement `addComment(postId, userId, body)` in `services/posts.ts`.
  4. Build a bottom input bar in `comments.tsx` with a `TextInput` and `Send` button.
- **Definition of done:**
  Users can view existing comments on a post and submit new comments that persist in Supabase and render in real time.

---

### ISS-COMM-002: Layout-Breaking `marginBottom: 200` on Comments Sheet Title
- **Priority:** Low
- **Exact Path:** `app/(modals)/comments.tsx` (line 77)
- **What is wrong:**
  ```tsx
  title: {
    textAlign: "center",
    fontWeight: "600",
    paddingVertical: 10,
    marginBottom: 200,
  },
  ```
- **Why it is a problem:**
  `marginBottom: 200` inserts 200 pixels of empty space directly below the "Comments" header, pushing the content down and breaking the bottom sheet layout.
- **What should be changed:**
  Change `marginBottom: 200` to `marginBottom: 10` or `marginBottom: 12`.
- **Definition of done:**
  Comments list renders immediately below the title header with clean spacing.

---

## 7. Reels

### ISS-REEL-001: Reels Feature Renders Static Images from `posts` Instead of Video
- **Priority:** Critical
- **Exact Path:** `services/reels.ts` (lines 8–20) and `components/reel/ReelItem.tsx` (lines 71–76)
- **What is wrong:**
  ```tsx
  // services/reels.ts:
  let query = supabase.from("posts").select("id, image_url,caption,location,aspect_ratio,profiles(username,avatar_url)")

  // components/reel/ReelItem.tsx:
  <ImageBackground source={{ uri: imageUrl }} style={[styles.page, { height: itemHeight }]}>
  ```
  Despite `expo-video` being installed in `package.json`, Reels does not use video. It queries regular image posts from the `posts` table and displays them as static photos in an `ImageBackground`.
- **Why it is a problem:**
  Instagram Reels are short-form vertical videos. Displaying static photos under a "Reels" tab breaks the fundamental expectation of the feature.
- **What should be changed:**
  1. Add a `video_url` column to Supabase or create a dedicated `reels` table.
  2. Replace `ImageBackground` in `ReelItem.tsx` with `VideoView` from `expo-video`.
  3. Implement play/pause on tap, audio toggling, and looping.
- **Definition of done:**
  The Reels tab plays real vertical MP4/HLS videos with smooth vertical snapping and playback controls.

---

### ISS-REEL-002: Severe N+1 Query Cascade on Every Reel Mount
- **Priority:** High
- **Exact Path:** `components/reel/ReelItem.tsx` (lines 34–51)
- **Component / Function:** `ReelItem` (`useEffect`)
- **What is wrong:**
  ```tsx
  useEffect(() => {
    const fetchLikeData = async () => {
      const [count, liked] = await Promise.all([
        fetchLikeCount(postId),
        currentUserId ? hasUserLiked(postId, currentUserId) : Promise.resolve(false),
      ]);
      setLikeCount(count);
      setIsLiked(liked);
    };
    fetchLikeData();
  }, [postId, currentUserId]);
  ```
- **Why it is a problem:**
  Every single reel item mounted in the list independently fires 2 separate queries to Supabase (`fetchLikeCount` and `hasUserLiked`). Swiping through 10 reels fires 20 database queries.
- **What should be changed:**
  Include like count and user like status in the initial batch query in `services/reels.ts` (via `likes(count)` and a joined user like check), passing initial values as props just like `PostItem.tsx`.
- **Definition of done:**
  Reels display like count and like status with zero additional database calls on item mount.

---

### ISS-REEL-003: Mismatched Tab Bar Height and Spacer Causing Reel Paging Misalignment
- **Priority:** Medium
- **Exact Path:** `app/(tabs)/reel.tsx` (lines 35, 38, 155)
- **What is wrong:**
  ```tsx
  const TAB_BAR_HEIGHT = 38; // line 35
  const ITEM_HEIGHT = SCREEN_HEIGHT - insets.top - insets.bottom - TAB_BAR_HEIGHT; // line 38
  ...
  <FlatList snapToInterval={ITEM_HEIGHT} ... />
  <View style={{ height: 60 }} /> // line 155
  ```
  In `app/(tabs)/_layout.tsx`, `tabBarStyle` specifies `height: 60`. In `reel.tsx`, `TAB_BAR_HEIGHT` is hardcoded as `38`. Line 155 adds an extra `<View style={{ height: 60 }} />` after the FlatList inside a container constrained to `height: SCREEN_HEIGHT`.
- **Why it is a problem:**
  Because the height deduction (38) does not match the actual tab bar height (60), `ITEM_HEIGHT` is too tall by 22px. The trailing 60px spacer adds extra offset. As the user swipes vertically, snap points drift out of alignment and reel items become clipped.
- **What should be changed:**
  Use the true tab bar height (60) or read actual container layout dimensions using `onLayout`, and remove the trailing spacer.
- **Definition of done:**
  Reel items match the exact visible viewport and snap cleanly without drift or clipping.

---

### ISS-REEL-004: Hardcoded Mock Comment Count on Reels
- **Priority:** Low
- **Exact Path:** `components/reel/ReelItem.tsx` (line 105)
- **What is wrong:**
  ```tsx
  <Image source={require("../../assets/images/Comment.png")} style={styles.icon} />
  <Text style={styles.iconText}>23</Text>
  ```
- **Why it is a problem:**
  Every single reel displays "23" as its comment count. The comment button also has no `onPress` handler.
- **What should be changed:**
  Connect to real comment count from database and wire `onPress` to open the comments bottom sheet.
- **Definition of done:**
  Comment count reflects actual comments on the reel and tapping opens the comments sheet.

---

## 8. Direct Messaging & Chat

### ISS-MSG-001: Messages Inbox Queries Entire User Directory Instead of User Conversations
- **Priority:** High
- **Exact Path:** `app/(tabs)/messages.tsx` (lines 65–75)
- **Component / Function:** `Messseges` (`fetchInboxData`)
- **What is wrong:**
  ```tsx
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, full_name, bio, avatar_url")
    .neq("id", user.id);
  ```
  The inbox queries all rows in `profiles` to generate the chat list.
- **Why it is a problem:**
  In a real app with thousands of users, the inbox attempts to load the entire user database into a FlatList. Users who have never messaged each other appear in the inbox.
- **What should be changed:**
  Query the `conversations` table for records where `user1_id = user.id OR user2_id = user.id`, join the peer user's profile, and only display active threads.
- **Definition of done:**
  Inbox only lists users with whom the active user has an established conversation.

---

### ISS-MSG-002: Sequential N+1 Database Queries in Inbox Message Loop
- **Priority:** High
- **Exact Path:** `app/(tabs)/messages.tsx` (lines 84–104)
- **Component / Function:** `Messseges` (`fetchInboxData`)
- **What is wrong:**
  ```tsx
  for (const convo of conversations) {
    ...
    const { data: lastMsgRow } = await supabase
      .from("messages")
      .select("sender_id, read_at")
      .eq("conversation_id", convo.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    ...
  }
  ```
- **Why it is a problem:**
  For `N` conversations, `N` sequential round-trip queries are executed one-by-one with `await` inside a loop. If a user has 20 conversations, the screen waits for 20 sequential database calls before finishing loading.
- **What should be changed:**
  Store `last_message_sender_id` and `last_message_read_at` directly in `conversations`, or fetch the latest messages in a single batch query.
- **Definition of done:**
  Inbox data loads in a single combined database query.

---

### ISS-MSG-003: Hardcoded Username "karan_7230" in Messages Header
- **Priority:** Low
- **Exact Path:** `app/(tabs)/messages.tsx` (line 273)
- **What is wrong:**
  ```tsx
  <Text style={messagestyles.headerTitle}>karan_7230</Text>
  ```
- **Why it is a problem:**
  Regardless of who is logged in, the inbox header permanently displays "karan_7230".
- **What should be changed:**
  Replace with dynamic user state: `{user?.username ?? "Direct"}`.
- **Definition of done:**
  The inbox displays the logged-in user's username.

---

### ISS-MSG-004: White Timestamp on Light Gray Chat Bubble Rendering Time Invisible
- **Priority:** Medium
- **Exact Path:** `app/chat/[id].tsx` (lines 293–297)
- **What is wrong:**
  ```tsx
  timeText: {
    alignSelf: "flex-end",
    fontSize: 10,
    color: "#f8f7f7", // Near-white text
  },
  bubbleOther: {
    backgroundColor: "#f0f0f0", // Light gray bubble
  },
  ```
- **Why it is a problem:**
  `#f8f7f7` text on `#f0f0f0` background has a contrast ratio of ~1.05:1 (failing WCAG AA accessibility standards). The timestamp on incoming messages from the other user is completely unreadable.
- **What should be changed:**
  Style `timeText` conditionally:
  ```tsx
  color: isMe ? "rgba(255,255,255,0.7)" : "#8e8e8e"
  ```
- **Definition of done:**
  Message timestamps are clearly legible on both outgoing blue bubbles and incoming gray bubbles.

---

### ISS-MSG-005: Screen Function Name Typo
- **Priority:** Low
- **Exact Path:** `app/(tabs)/messages.tsx` (line 49)
- **What is wrong:**
  `export default function Messseges()` (misspelled with three 's's).
- **Why it is a problem:**
  Code hygiene and developer ergonomics issue.
- **What should be changed:**
  Rename to `export default function Messages()`.
- **Definition of done:**
  Exported component name is spelled correctly.

---

## 9. Search & Explore

### ISS-EXPL-001: Unbounded Explore Query Fetches All Posts from Database
- **Priority:** High
- **Exact Path:** `app/(tabs)/search.tsx` (lines 37–43)
- **Component / Function:** `Search` (`fetchImages`)
- **What is wrong:**
  ```tsx
  const { data: allPosts, error } = await supabase
    .from("posts")
    .select("id, image_url, caption, location, user_id, profiles(username, avatar_url)")
    .order("created_at", { ascending: false });
  ```
- **Why it is a problem:**
  The query does not specify `.limit()` or `.range()`. When the database contains thousands of posts, opening the Search/Explore tab downloads the entire table, leading to high latency and out-of-memory crashes on mobile devices.
- **What should be changed:**
  Implement pagination using `.range(0, 20)` and add infinite scroll with `onEndReached`.
- **Definition of done:**
  Explore posts load in paginated batches of 18–24 items with infinite scrolling.

---

## 10. User Profiles & Social Graph

### ISS-PROF-001: Hardcoded "59" Followers and Following Counts
- **Priority:** High
- **Exact Path:** `app/(tabs)/profile.tsx` (lines 146–152) and `app/screens/userProfile.tsx` (lines 214–222)
- **What is wrong:**
  Both screens hardcode follower and following statistics:
  ```tsx
  <View>
    <Text>59</Text>
    <Text>followers</Text>
  </View>
  <View>
    <Text>59</Text>
    <Text>following</Text>
  </View>
  ```
- **Why it is a problem:**
  Every user profile in the app displays 59 followers and 59 following, regardless of real database data.
- **What should be changed:**
  Query the count of records from `follows`:
  ```ts
  const followersCount = await supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", userId);
  const followingCount = await supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", userId);
  ```
- **Definition of done:**
  Follower and following counts reflect actual database counts for both own profile and other users' profiles.

---

### ISS-PROF-002: Blank Unimplemented "Tagged / Mentions" Tab
- **Priority:** Medium
- **Exact Path:** `app/(tabs)/profile.tsx` (line 267) and `app/screens/userProfile.tsx` (line 331)
- **What is wrong:**
  ```tsx
  data={activeTab === "posts" ? posts : []}
  ```
- **Why it is a problem:**
  Switching to the tagged posts tab (`activeTab === "mentions"`) renders an empty array `[]` with no empty state indicator, no explanation, and no mechanism to query or display tagged photos.
- **What should be changed:**
  Either build a `post_tags` table to query tagged posts, or display a standard Instagram empty state: "Photos and videos of you. When people tag you in photos and videos, they'll appear here."
- **Definition of done:**
  Switching to mentions either displays tagged posts or a clean empty-state view.

---

### ISS-PROF-003: Dummy Uncontrolled Fields in Edit Profile Screen
- **Priority:** Medium
- **Exact Path:** `app/screens/editProfile.tsx` (lines 161–177)
- **Component / Function:** `EditPost`
- **What is wrong:**
  1. "Switch to Proffesional Account" (lines 161–165): Typo in label, wrapped in `<TouchableOpacity>` with no `onPress`.
  2. Email Input (lines 166–169): `<Input placeholder="email" />` has no `value` or `onChangeText`.
  3. Phone Input (lines 170–173): `<Input placeholder="phone" />` has no `value` or `onChangeText`.
  4. Gender Input (lines 174–177): `<Input placeholder="gender" />` has no `value` or `onChangeText`.
  5. Username editing: Completely absent. Users cannot change their handle.
- **Why it is a problem:**
  Form fields give the illusion of configurability, but input is completely dropped and never persisted.
- **What should be changed:**
  Bind fields to user profile state or remove unsupported fields, add username editing with uniqueness validation, and fix the typo.
- **Definition of done:**
  All rendered fields in Edit Profile are controlled, validate properly, and persist changes to Supabase.

---

### ISS-PROF-004: Incorrect Component Name in Edit Profile File
- **Priority:** Low
- **Exact Path:** `app/screens/editProfile.tsx` (line 35)
- **What is wrong:**
  `export default function EditPost()` in `editProfile.tsx`.
- **Why it is a problem:**
  Misleading naming causing confusion during debugging and React component tree inspection.
- **What should be changed:**
  Rename to `export default function EditProfile()`.
- **Definition of done:**
  Component name matches file purpose and route.

---

## 11. Stories & Highlights

### ISS-STRY-001: Story and Highlight Viewers Lack Auto-Advance, Timers, and Gestures
- **Priority:** High
- **Exact Path:** `app/(modals)/story.tsx` (lines 12–50) and `app/screens/highlight.tsx` (lines 12–52)
- **What is wrong:**
  Both screens render a single static `<Image>` covering the screen. There are:
  - No progress bars indicating story playback duration.
  - No automatic timer advancing to the next story or closing after 5 seconds.
  - No tap gestures (tap left for previous, tap right for next, press and hold to pause).
  - No close/dismiss button.
- **Why it is a problem:**
  The screens do not behave like Instagram Stories. Users who open a story are stuck looking at a static image until they trigger the system hardware back button.
- **What should be changed:**
  Implement animated segmented progress bars, 5-second automatic progression, tap gesture handlers, and a close button.
- **Definition of done:**
  Stories progress automatically, allow pause on long-press, tap to skip, and provide an explicit close button.

---

### ISS-STRY-002: Storage Bucket Casing Mismatch in `addHighlight.tsx`
- **Priority:** High
- **Exact Path:** `app/screens/addHighlight.tsx` (line 62) vs (line 71)
- **What is wrong:**
  ```tsx
  // Storage upload uses capitalized "Highlight":
  const { error: uploadError } = await supabase.storage
    .from("Highlight")
    .upload(fileName, arrayBuffer, ...);

  // Database insert uses lowercase "highlight":
  const { error: insertError } = await supabase
    .from("highlight")
    .insert(...);
  ```
- **Why it is a problem:**
  Supabase storage bucket identifiers are case-sensitive. If the bucket was created with lowercase name `highlight` (or `highlights`), the storage upload fails with `Bucket not found`.
- **What should be changed:**
  Standardize bucket naming across the codebase to lowercase `highlights` or `highlight`.
- **Definition of done:**
  Storage bucket name matches the exact Supabase bucket configuration.

---

### ISS-STRY-003: Stories Never Expire After 24 Hours
- **Priority:** Medium
- **Exact Path:** `services/stories.ts` (lines 10–22) and `app/screens/addStory.tsx` (lines 79–85)
- **What is wrong:**
  ```tsx
  export async function fetchStories(): Promise<Story[]> {
    const { data, error } = await supabase
      .from("story")
      .select("image_url,id,profiles(username, avatar_url)")
      .order("created_at", { ascending: false });
    ...
  }
  ```
- **Why it is a problem:**
  Stories on Instagram expire after 24 hours. The database query has no timestamp filter (`created_at > NOW() - 24 hours`). Stories posted weeks ago remain permanently in the feed.
- **What should be changed:**
  Add a filter:
  ```ts
  .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
  ```
- **Definition of done:**
  Only stories published within the past 24 hours appear in the active story reel.

---

## 12. Notifications

### ISS-NOTF-001: Notifications Screen is Entirely Static Mock Data
- **Priority:** High
- **Exact Path:** `app/screens/notifications.tsx` (lines 11–152)
- **Component / Function:** `Notification`
- **What is wrong:**
  The entire screen consists of hardcoded JSX items (`karennne liked your photo`, `kiero_d, zackjohn and 26 others...`, `craig_love mentioned you...`). There is no database table, no Supabase query, and the "Message" and "Follow" buttons have no event handlers.
- **Why it is a problem:**
  Users receive no actual updates when someone likes their posts, comments, or follows them.
- **What should be changed:**
  1. Create a `notifications` table in Supabase (`id, user_id, actor_id, type, post_id, created_at, read`).
  2. Implement triggers or service calls to generate notifications on like/comment/follow.
  3. Query dynamic notifications in `notifications.tsx`.
- **Definition of done:**
  Notifications screen displays live events generated by real user interactions.

---

## 13. Settings

### ISS-SETT-001: Settings Options are No-Op Stubs and Private Account Toggle is Non-Persistent
- **Priority:** Medium
- **Exact Path:** `app/screens/settings.tsx` (lines 46–72)
- **Component / Function:** `Settings`
- **What is wrong:**
  1. `Notifications`: `onPress={() => {}}` (empty stub).
  2. `Account`: `onPress={() => {}}` (empty stub).
  3. `Blocked user`: `onPress={() => {}}` (empty stub).
  4. `Private account`: `<Switch value={isPrivate} onValueChange={setIsPrivate} />` updates a local React state variable that is never saved to the database.
  5. Dark mode toggle: Completely absent.
- **Why it is a problem:**
  The settings screen is non-functional. Users cannot manage their notifications, view blocked users, toggle theme, or persist account privacy.
- **What should be changed:**
  Persist privacy setting to `profiles.is_private`, provide working sub-screens or modals for account settings, and add a Theme mode selector.
- **Definition of done:**
  Settings actions either perform their intended function or are cleanly hidden until implemented, and privacy settings persist to Supabase.

---

## 14. Media Handling & Platform APIs

### ISS-MEDIA-001: Unreliable `fetch(localUri).arrayBuffer()` Used for File Uploads
- **Priority:** High
- **Exact Path:**
  - `app/screens/addPost.tsx` (lines 64–66)
  - `app/screens/addStory.tsx` (lines 59–61)
  - `app/screens/addHighlight.tsx` (lines 56–58)
- **What is wrong:**
  ```tsx
  const response = await fetch(selectedImage);
  const arrayBuffer = await response.arrayBuffer();
  ```
- **Why it is a problem:**
  In React Native on Android, calling global `fetch()` on `file://` or `content://` URIs is known to cause memory leaks, crashes with high-resolution images, and outright failures depending on the engine. Meanwhile, `editProfile.tsx` correctly uses `decode(result.assets[0].base64)` with `base64-arraybuffer`.
- **What should be changed:**
  Standardize image uploading across all screens using `base64-arraybuffer` or `expo-file-system`.
- **Definition of done:**
  Media uploads use a reliable, memory-safe mechanism that works consistently on both iOS and Android.

---

### ISS-MEDIA-002: DOM Web `alert()` Used in Mobile Screens
- **Priority:** Low
- **Exact Path:**
  - `app/screens/addPost.tsx` (lines 29, 51, 59, 75, 96, 103)
  - `app/screens/addStory.tsx` (lines 24, 46, 54, 70, 88, 96)
  - `app/screens/addHighlight.tsx` (lines 24, 46, 80)
- **What is wrong:**
  These screens call window `alert(...)` instead of `Alert.alert(...)` from `react-native`.
- **Why it is a problem:**
  `alert()` is a web browser API. In native Android/iOS runtimes, it causes unstyled native dialogs or unhandled exceptions depending on platform shims.
- **What should be changed:**
  Import `Alert` from `react-native` and use `Alert.alert("Title", "Message")`.
- **Definition of done:**
  All user-facing alert dialogs use React Native's native `Alert.alert`.

---

## 15. Code Quality & Dead Code

### ISS-CODE-001: Massive Commented-Out Boilerplate ("FUTURE USE") Across Services and Hooks
- **Priority:** High
- **Exact Path:**
  - `services/messages.ts` (100% commented out, lines 1–70)
  - `hooks/useAuth.ts` (100% commented out, lines 1–8)
  - `hooks/usePosts.ts` (100% commented out, lines 1–31)
  - `hooks/useProfile.ts` (100% commented out, lines 1–26)
  - `services/auth.ts` (lines 11–25 commented out)
  - `services/users.ts` (lines 3–27 and 43–52 commented out)
  - `services/stories.ts` (lines 24–39 commented out)
  - `constants/colors.ts` (100% commented out, lines 1–14)
  - `constants/sizes.ts` (100% commented out, lines 1–13)
  - `utils/format.ts` (100% commented out, lines 1–13)
- **What is wrong:**
  Over 300 lines of core application infrastructure are wrapped in `/* FUTURE USE — uncomment when ... */`. Instead of using these hooks and services, screens bypass them and duplicate raw Supabase queries inline.
- **Why it is a problem:**
  Creates massive code duplication, inconsistent error handling, unused helper files, and architectural confusion.
- **What should be changed:**
  Uncomment and finish the service/hook layer, and refactor screens to consume hooks instead of writing raw database queries inside UI components.
- **Definition of done:**
  Services and hooks are active, typed, and consumed cleanly by the screen components.

---

### ISS-CODE-002: Unused Heavy Dependencies in `package.json`
- **Priority:** Low
- **Exact Path:** `package.json`
- **What is wrong:**
  The following packages are installed in `package.json` but are never imported anywhere in `app/`, `components/`, `context/`, `hooks/`, or `services/`:
  - `@reduxjs/toolkit` (`^2.12.0`)
  - `react-redux` (`^9.3.0`)
  - `axios` (`^1.18.0`)
  - `expo-haptics` (`~57.0.1`)
  - `expo-symbols` (`~57.0.1`)
  - `expo-system-ui` (`~57.0.1`)
- **Why it is a problem:**
  Increases app install size, slows down `npm install`, bloats bundle size, and confuses maintainers about whether Redux or Context is the state management standard.
- **What should be changed:**
  Remove unused packages (`axios`, `@reduxjs/toolkit`, `react-redux`), or wire them if intended (e.g., wiring `expo-haptics` for like feedback).
- **Definition of done:**
  `package.json` contains only dependencies that are actively imported and used.

---

## 16. Theming & Dark Mode

### ISS-THM-001: Pervasive Hardcoded Light Mode Styling Causing Dark Mode Contrast Failures
- **Priority:** High
- **Exact Path:**
  - `app/(auth)/login.tsx` (hardcoded `backgroundColor: "white"`)
  - `app/(auth)/signup.tsx` (hardcoded `backgroundColor: "white"`)
  - `app/(tabs)/messages.tsx` (hardcoded `backgroundColor: "#ffffff"`, text `#000000`)
  - `app/(tabs)/search.tsx` (hardcoded `backgroundColor: "white"`)
  - `app/(tabs)/profile.tsx` (hardcoded `backgroundColor: "white"`)
  - `app/screens/settings.tsx` (hardcoded `backgroundColor: "#fff"`)
  - `app/screens/notifications.tsx` (hardcoded `backgroundColor: "#fff"`)
  - `app/screens/searchUser.tsx` (hardcoded `backgroundColor: "#ffffff"`)
  - `app/screens/editProfile.tsx` (hardcoded `backgroundColor: "white"`)
  - `app/screens/addPost.tsx` (hardcoded `backgroundColor: "white"`)
  - `app/screens/addStory.tsx` (hardcoded `backgroundColor: "white"`)
  - `app/screens/addHighlight.tsx` (hardcoded `backgroundColor: "white"`)
  - `app/(modals)/comments.tsx` (hardcoded light styling)
  - `components/common/ErrorBoundary.tsx` (hardcoded `backgroundColor: "#fff"`)
- **What is wrong:**
  Although `ThemeProvider` exists in `context/ThemeContext.tsx`, 14 major screens and components completely ignore `useTheme()` and hardcode white backgrounds and black text styles.
- **Why it is a problem:**
  When a user's system is set to dark mode, navigating between screens produces a jarring contrast mismatch: the home feed renders dark, but tapping Search, Messages, Notifications, or Profile blinds the user with pure white backgrounds.
- **What should be changed:**
  Refactor all screens to use `const { theme } = useTheme();` and apply `theme.background`, `theme.text`, `theme.border`, and `theme.card`.
- **Definition of done:**
  All screens seamlessly respect light and dark themes with appropriate background, card, border, and text colors.

---

## 17. Skeletons & Accessibility

### ISS-SKEL-001: Static High-Contrast Skeleton Loaders Lacking Shimmer and Dark Mode Support
- **Priority:** Low
- **Exact Path:**
  - `components/skeletons/FeedLoading.tsx`
  - `components/skeletons/PostLoading.tsx`
  - `components/skeletons/ProfileLoading.tsx`
  - `components/skeletons/ReelLoading.tsx`
- **What is wrong:**
  All skeleton screens use static `#dcdcdc` placeholder boxes with no animation. In dark mode, `#dcdcdc` bright gray blocks appear jarringly intense against black backgrounds.
- **Why it is a problem:**
  Poor perceived loading performance and harsh visual flicker during data fetches.
- **What should be changed:**
  Introduce an animated pulse/shimmer using `react-native-reanimated` and theme-aware placeholder colors (`#2a2a2a` in dark mode).
- **Definition of done:**
  Skeleton placeholders pulse smoothly and match the active theme palette.

---

## UNVERIFIED

The following items cannot be fully verified from the client-side code repository alone:

1. **Supabase Row-Level Security (RLS) Policies:**  
   The codebase contains no `.sql` migration files. It is unverified whether the remote Supabase database has enabled RLS on `posts`, `profiles`, `likes`, `follows`, `messages`, and `conversations`. If RLS is disabled or improperly configured remotely, any client could delete or alter any user's records.
2. **Supabase Storage Bucket Permissions & Size Limits:**  
   Bucket configurations for `posts`, `avatars`, `story`, and `Highlight` reside on the Supabase dashboard. It is unverified whether public read permissions, authenticated-only write permissions, and MIME type restrictions (e.g. max 10MB) are enforced on the storage buckets.
3. **Expo Push Notification Credentials & EAS Build Profiles:**  
   `app.json` has minimal build configuration with no EAS build profiles (`eas.json` is missing). Remote push notification delivery and release build automation cannot be verified from the codebase.
