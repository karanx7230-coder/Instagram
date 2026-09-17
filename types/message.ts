export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  created_at: string;
  read_at: string | null;
};

export type Conversation = {
  id: string;
  last_message: string;
  last_message_at: string;
};
