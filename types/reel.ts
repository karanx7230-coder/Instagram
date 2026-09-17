export type Reel = {
  id: string;
  image_url: string;
  caption: string;
  location: string;
  user_id: string;
  aspect_ratio: number;
  profiles?: {
    username: string;
    avatar_url: string;
  };
};

export type ReelItemProps = {
  postId: string;
  currentUserId: string;
  imageUrl: string;
  caption: string;
  username: string;
  avatarUrl: string;
  location?: string;
  aspect?: number;
  itemHeight: number;
};
