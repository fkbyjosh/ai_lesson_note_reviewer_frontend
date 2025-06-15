
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export function useChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(text: string) {
    setLoading(true);
    setError(null);
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    try {
      const { data, error: funcError } = await supabase.functions.invoke("chatbot", {
        body: { messages: newMessages },
      });
      if (funcError) throw funcError;
      setMessages([...newMessages, { role: "assistant", content: data.answer }]);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
    setLoading(false);
  }
  return { messages, sendMessage, loading, error };
}
