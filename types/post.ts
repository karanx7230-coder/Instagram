export type PostProfile = {
  username: string;
  avatar_url: string;
};

export type LikeCount = {
  count: number;
};

export type Post = {
  id: string;
  image_url: string;
  caption: string;
  location: string;
  user_id: string;
  aspect_ratio: number;
  profiles: PostProfile;
  likes: LikeCount[];
};

export type PostItemProps = {
  postId: string;
  currentUserId: string;
  imageUrl: string;
  caption: string;
  username: string;
  avatarUrl: string;
  location?: string;
  aspect?: number;
  initialLikeCount: number;
  initialIsLiked: boolean;
};

export type CommentUser = {
  id: number;
  username: string;
};

export type PostComment = {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: CommentUser;
};
