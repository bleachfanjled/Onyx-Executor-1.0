import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles, X, Send } from "lucide-react";

const SYSTEM_PROMPT = `You are Onyx AI, a helpful assistant embedded in the Onyx Roblox script executor. Your role is strictly educational:

- You EXPLAIN scripting concepts, Lua syntax, and Roblox API usage
- You HELP DEBUG scripts by pointing out errors and suggesting fixes
- You GUIDE users toward writing their own code through explanation and hints
- You NEVER write complete, ready-to-execute scripts
- You NEVER assist with exploits, bypasses, anti-cheat evasion, or malicious code
- You keep responses concise (2-4 sentences) unless the user asks for detail
- You are friendly but firm about safety boundaries

If asked to write a full script, politely decline and offer to explain the concepts instead.`;

export default function AIAssistant({ open, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey! I'm Onyx AI. I can explain scripting concepts, help debug your code, and guide you through learning. What would you like to understand?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const conversation = newMessages
        .map((m) => `${m.role === "user" ? "User" : "Onyx AI"}: ${m.content}`)
        .join("\n");
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `${SYSTEM_PROMPT}\n\nConversation so far:\n${conversation}\n\nOnyx AI:`,
      });
      setMessages([
        ...newMessages,
        { role: "assistant", content: typeof res === "string" ? res : "Sorry, I couldn't process that." },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, I couldn't process that right now." },
      ]);
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed right-0 z-50 flex flex-col border-l"
      style={{
        top: "56px",
        bottom: 0,
        width: "384px",
        backgroundColor: "#0D0D0D",
        borderColor: "#1A1A1A",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b shrink-0" style={{ borderColor: "#1A1A1A" }}>
        <div className="flex items-center gap-2">
          <Sparkles size={14} style={{ color: "#FFFFFF" }} />
          <span className="text-white text-xs font-bold uppercase" style={{ letterSpacing: "0.2em" }}>
            Onyx AI
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-[#959595] hover:text-white transition-colors"
          aria-label="Close AI assistant"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className="px-3 py-2 text-xs leading-relaxed max-w-[85%]"
              style={
                msg.role === "user"
                  ? { backgroundColor: "#FFFFFF", color: "#050505" }
                  : { backgroundColor: "#050505", color: "#FFFFFF", border: "1px solid #1A1A1A" }
              }
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div
              className="px-3 py-2 text-xs"
              style={{ backgroundColor: "#050505", color: "#959595", border: "1px solid #1A1A1A" }}
            >
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t shrink-0" style={{ borderColor: "#1A1A1A" }}>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask about scripting concepts..."
            className="flex-1 px-3 py-2 text-xs text-white outline-none"
            style={{ backgroundColor: "#050505", border: "1px solid #1A1A1A" }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="p-2 text-white transition-colors disabled:opacity-30"
            style={{ backgroundColor: "#050505", border: "1px solid #1A1A1A" }}
            aria-label="Send message"
          >
            <Send size={14} />
          </button>
        </div>
        <p className="mt-2 text-[9px]" style={{ color: "#3A3A3A", letterSpacing: "0.1em" }}>
          EDUCATIONAL ONLY — EXPLAINS CONCEPTS, WON'T WRITE SCRIPTS
        </p>
      </div>
    </div>
  );
}