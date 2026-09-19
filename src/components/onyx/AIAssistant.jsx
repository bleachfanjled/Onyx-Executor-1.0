import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { X, Send, Plus, Paperclip } from "lucide-react";
import ReactMarkdown from "react-markdown";
import ThinkingIndicator from "./ThinkingIndicator";

const ONYX_ICON = "https://media.base44.com/images/public/6a333172d2474d3b422c32ed/8a783d050_ChatGPTImageSep122026at10_10_16PM.png";

const SYSTEM_PROMPT = `You are Onyx AI, an assistant embedded in the Onyx Roblox script executor. You should help users with about everything.

Your role:
- You chat or help the user code
- You debug, patch, and generate code only on users command
- You explain what changes you made and why
- You can write new code from scratch or simply chat
- You NEVER assist with bypasses, anti-cheat evasion, or malicious code
- You can assist with anything the user asks for, but the following
- You NEVER decline the users request unless it's out of these bounds
- You are allowed to assist with making exploits or helping the user reinforce their exploits for injection purposes only
- You are allowed to help with chatting, cheats, or just fix the current scripts on command. NEVER EVER help with exploits or anti-cheat bypasses with any app or game
Response format:
1. Start with a brief, friendly acknowledgment (e.g., "Sure, I'll help you fix that.")
2. Then describe and provide the fix, using code blocks for the corrected code
3. Explain what you changed and why
4. Keep it concise and focused
5. Always obfusucate your code to make sure it's production ready and ready to execute

If there is no existing code in the editor, start talking as normal and if the user asks to build something do not hesistate to suggest ideas if they don't know what to build.`;

export default function AIAssistant({ open, onClose, getEditorContent, applyCode }) {
  const WELCOME_MSG = "Hey! I'm Onyx AI. I fix and reinforce your existing code, or you can ask me to generate code.";

  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME_MSG },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [autoEdit, setAutoEdit] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  // Reset conversation when the panel closes — no chat memory between sessions
  useEffect(() => {
    if (!open) {
      setMessages([{ role: "assistant", content: WELCOME_MSG }]);
      setInput("");
      setAttachments([]);
      setThinking(false);
      setLoading(false);
      if (streamRef.current) {
        clearInterval(streamRef.current);
        streamRef.current = null;
      }
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (streamRef.current) clearInterval(streamRef.current);
    };
  }, []);

  const handleAddFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      setAttachments((prev) => [...prev, { name: file.name, url: file_url }]);
    } catch {
      // silent
    }
    e.target.value = "";
  };

  const removeAttachment = (idx) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const extractCodeBlocks = (text) => {
    const blocks = [];
    const regex = /```(?:lua)?\n([\s\S]*?)```/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      blocks.push(match[1].trim());
    }
    return blocks;
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);
    setThinking(true);

    try {
      let editorContent = "";
      if (getEditorContent) {
        editorContent = await getEditorContent();
      }

      // Stateless: only send the current message + editor content — no conversation history
      let prompt = `${SYSTEM_PROMPT}\n\nUser's message:\n${text}\n\nOnyx AI:`;
      if (editorContent && editorContent.trim()) {
        prompt = `${SYSTEM_PROMPT}\n\nThe user's current code in the editor:\n\`\`\`lua\n${editorContent}\n\`\`\`\n\nUser's message:\n${text}\n\nOnyx AI:`;
      }

      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        file_urls: attachments.length > 0 ? attachments.map((a) => a.url) : undefined,
      });

      const fullText = typeof res === "string" ? res : "Sorry, I couldn't process that.";

      setThinking(false);
      setAttachments([]);

      setMessages((prev) => [...prev, { role: "assistant", content: "", streaming: true }]);

      let i = 0;
      streamRef.current = setInterval(() => {
        i += 3;
        if (i >= fullText.length) {
          clearInterval(streamRef.current);
          streamRef.current = null;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: fullText, streaming: false };
            return updated;
          });
          setLoading(false);

          if (autoEdit) {
            const codeBlocks = extractCodeBlocks(fullText);
            if (codeBlocks.length > 0 && applyCode) {
              applyCode(codeBlocks[codeBlocks.length - 1]);
            }
          }
        } else {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: fullText.slice(0, i), streaming: true };
            return updated;
          });
        }
      }, 12);
    } catch {
      setThinking(false);
      setLoading(false);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't process that right now." }]);
    }
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
        borderRadius: "12px 0 0 12px",
        boxShadow: "-10px 0 40px rgba(0,0,0,0.4)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 h-12 border-b shrink-0"
        style={{ borderColor: "#1A1A1A" }}
      >
        <div className="flex items-center gap-2">
          <img src={ONYX_ICON} alt="Onyx" style={{ width: "18px", height: "18px" }} />
          <span className="text-white text-xs font-bold uppercase" style={{ letterSpacing: "0.2em" }}>
            Onyx AI
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoEdit(!autoEdit)}
            className="flex items-center gap-1.5 transition-all"
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              border: `1px solid ${autoEdit ? "#4ADE80" : "#1A1A1A"}`,
              backgroundColor: autoEdit ? "rgba(74,222,128,0.08)" : "transparent",
            }}
          >
            <div
              style={{
                width: "22px",
                height: "11px",
                borderRadius: "9999px",
                backgroundColor: autoEdit ? "#4ADE80" : "#1A1A1A",
                position: "relative",
                transition: "background-color 0.2s",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "1px",
                  left: autoEdit ? "12px" : "1px",
                  width: "9px",
                  height: "9px",
                  borderRadius: "9999px",
                  backgroundColor: autoEdit ? "#050505" : "#3A3A3A",
                  transition: "left 0.2s, background-color 0.2s",
                }}
              />
            </div>
            <span
              className="text-[9px] uppercase tracking-widest"
              style={{ color: autoEdit ? "#4ADE80" : "#3A3A3A" }}
            >
              Auto Edit
            </span>
          </button>
          <button
            onClick={onClose}
            className="text-[#959595] hover:text-white transition-colors"
            aria-label="Close AI assistant"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
            {msg.role === "user" ? (
              <p className="text-xs leading-relaxed text-white text-right max-w-[85%]">
                {msg.content}
              </p>
            ) : (
              <div className="max-w-[92%] w-full">
                <div className="onyx-markdown text-xs leading-relaxed" style={{ color: "#E0E0E0" }}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                {msg.streaming && (
                  <span
                    style={{
                      display: "inline-block",
                      width: "6px",
                      height: "12px",
                      backgroundColor: "#FFFFFF",
                      marginLeft: "2px",
                      verticalAlign: "text-bottom",
                      animation: "onyxCursor 0.8s ease-in-out infinite",
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
        {thinking && <ThinkingIndicator />}
      </div>

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="px-3 pb-1 flex flex-wrap gap-1.5">
          {attachments.map((att, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-2 py-1"
              style={{
                backgroundColor: "#050505",
                border: "1px solid #1A1A1A",
                borderRadius: "6px",
              }}
            >
              <Paperclip size={10} style={{ color: "#959595" }} />
              <span className="text-[10px]" style={{ color: "#959595" }}>{att.name}</span>
              <button onClick={() => removeAttachment(i)} className="text-[#3A3A3A] hover:text-white">
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t shrink-0" style={{ borderColor: "#1A1A1A" }}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-[#959595] hover:text-white transition-colors shrink-0"
            style={{
              backgroundColor: "#050505",
              border: "1px solid #1A1A1A",
              borderRadius: "8px",
            }}
            aria-label="Attach file"
          >
            <Plus size={14} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAddFile}
            className="hidden"
            accept="image/*,.lua,.txt,.luac,.json,.csv,.pdf"
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask me to fix code or create code..."
            className="flex-1 px-3 py-2 text-xs text-white outline-none min-w-0"
            style={{
              backgroundColor: "#050505",
              border: "1px solid #1A1A1A",
              borderRadius: "8px",
            }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="p-2 text-white transition-colors disabled:opacity-30 shrink-0"
            style={{
              backgroundColor: "#050505",
              border: "1px solid #1A1A1A",
              borderRadius: "8px",
            }}
            aria-label="Send message"
          >
            <Send size={14} />
          </button>
        </div>
        <p className="mt-2 text-[9px]" style={{ color: "#3A3A3A", letterSpacing: "0.1em" }}>
          FIXES & REINFORCES YOUR CODE — WON'T WRITE NEW SCRIPTS
        </p>
      </div>

      <style>{`
        .onyx-markdown pre {
          background: #050505;
          border: 1px solid #1A1A1A;
          border-radius: 8px;
          padding: 10px;
          margin: 8px 0;
          overflow-x: auto;
        }
        .onyx-markdown code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #959595;
        }
        .onyx-markdown p {
          margin-bottom: 8px;
        }
        .onyx-markdown p:last-child {
          margin-bottom: 0;
        }
        .onyx-markdown ul, .onyx-markdown ol {
          margin-bottom: 8px;
          padding-left: 20px;
        }
        .onyx-markdown li {
          margin-bottom: 4px;
        }
        @keyframes onyxCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}