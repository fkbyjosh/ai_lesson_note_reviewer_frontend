
import { useRef, useEffect } from "react";
import { useChatbot } from "@/hooks/useChatbot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatbotUI() {
  const { messages, sendMessage, loading, error } = useChatbot();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSend(event: React.FormEvent) {
    event.preventDefault();
    const text = inputRef.current?.value?.trim();
    if (text) {
      sendMessage(text);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  // Scroll to bottom when messages change
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-lg shadow-md flex flex-col h-[500px]">
      <div className="flex-shrink-0 p-4 border-b bg-skyBlue/10">
        <h2 className="text-lg font-bold text-skyBlue">AI Chatbot</h2>
        <p className="text-sm text-gray-600">Ask anything about teaching, lesson plans, or classroom tips!</p>
      </div>
      <div className="flex-grow px-4 py-2 overflow-y-auto space-y-3 bg-gradient-to-b from-skyBlue/5 to-white">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 my-12">
            Start the conversation!
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <span
              className={`px-4 py-2 rounded-lg max-w-xs whitespace-pre-line ${
                m.role === "user"
                  ? "bg-skyBlue text-white"
                  : m.role === "assistant"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-yellow-100 text-gray-800"
              }`}
            >
              {m.content}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {error && (
        <div className="text-red-500 px-4 pb-2">{error}</div>
      )}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 p-4 border-t"
      >
        <Input
          ref={inputRef}
          placeholder="Type your message…"
          disabled={loading}
          className="flex-1"
        />
        <Button
          type="submit"
          className="bg-skyBlue text-white"
          disabled={loading}
        >
          {loading ? "Sending…" : "Send"}
        </Button>
      </form>
    </div>
  );
}
