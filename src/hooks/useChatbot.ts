
import { useState } from "react";

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
    
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    
    try {
      // TODO: Replace with your custom backend API call
      // Example: const response = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ messages: newMessages }) });
      
      // Mock response for now
      setTimeout(() => {
        setMessages([...newMessages, { 
          role: "assistant" as const, 
          content: "This is a placeholder response. Please connect your custom backend API." 
        }]);
        setLoading(false);
      }, 1000);
      
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setLoading(false);
    }
  }

  return { messages, sendMessage, loading, error };
}
