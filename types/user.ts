export type Profile = {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  email: string;
};

export type PublicProfile = {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string;
};

export type User = {
  id: string;
  email: string;
  username: string;
  name: string;
  bio: string;
  avatar_url: string;
};
