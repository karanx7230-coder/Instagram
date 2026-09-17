/* FUTURE USE — whole file commented out until chat/messaging screens are
   wired to these helpers. Uncomment when needed.
import { supabase } from "@/services/supabase";
import { config } from "@/constants/config";
import type { Conversation, Message } from "@/types/message";

export async function fetchMessages(
  conversationId: string,
): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(config.messagesPageSize);
  if (error) throw error;
  return (data ?? []) as Message[];
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  text: string,
): Promise<Message> {
  const { data, error } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, sender_id: senderId, text })
    .select()
    .single();
  if (error) throw error;
  return data as Message;
}

export async function markConversationRead(
  conversationId: string,
  userId: string,
) {
  return supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .neq("sender_id", userId)
    .is("read_at", null);
}

export async function updateConversationPreview(
  conversationId: string,
  lastMessage: string,
) {
  return supabase
    .from("conversations")
    .update({
      last_message: lastMessage,
      last_message_at: new Date().toISOString(),
    })
    .eq("id", conversationId);
}

export async function fetchConversations(
  userId: string,
): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .order("last_message_at", { ascending: false });
  if (error) throw error;
  void userId;
  return (data ?? []) as Conversation[];
}
*/

export {};
