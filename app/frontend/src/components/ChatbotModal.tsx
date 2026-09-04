"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Trash2, Bot, User, ExternalLink } from "lucide-react";
import { UserProfileData } from "./ProfileForm";
import BackButton from "./BackButton";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  isError?: boolean;
}

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfileData | null;
}

const SAMPLE_PROMPTS = [
  "What documents are required for PM-KISAN?",
  "What benefits does Ayushman Bharat PM-JAY provide?",
  "Who can apply for National Means-cum-Merit Scholarship?",
  "What schemes are available for Farmers or Students?"
];

export const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose, userProfile }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "assistant",
      text: "Hello! I am **Yojana Saathi AI**, your government scheme guidance assistant.\n\nHow can I help you understand government schemes, benefits, eligibility criteria, or required documents today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          userProfile: userProfile || null
        })
      });

      if (!res.ok) {
        throw new Error("Server responded with error");
      }

      const data = await res.json();
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: data.reply || "I apologize, but I could not generate a response. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        sender: "assistant",
        text: "Sorry, I encountered an issue connecting to the assistant service. Please verify your connection or try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "assistant",
        text: "Conversation cleared. How else can I assist you with government schemes?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  const renderMarkdown = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, lIdx) => {
      let formatted = line;

      // Render links [title](url)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(formatted)) !== null) {
        if (match.index > lastIndex) {
          parts.push(formatted.substring(lastIndex, match.index));
        }
        parts.push(
          <a
            key={match.index}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium inline-flex items-center gap-0.5"
          >
            {match[1]} <ExternalLink className="w-3 h-3 inline" />
          </a>
        );
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < formatted.length) {
        parts.push(formatted.substring(lastIndex));
      }

      // Bold text **text**
      const processBold = (inputParts: (string | JSX.Element)[]) => {
        const result: (string | JSX.Element)[] = [];
        inputParts.forEach((part, pIdx) => {
          if (typeof part !== "string") {
            result.push(part);
            return;
          }
          const boldParts = part.split(/\*\*([^*]+)\*\*/g);
          boldParts.forEach((bPart, bIdx) => {
            if (bIdx % 2 === 1) {
              result.push(<strong key={`${pIdx}-${bIdx}`} className="font-semibold text-slate-900">{bPart}</strong>);
            } else if (bPart) {
              result.push(bPart);
            }
          });
        });
        return result;
      };

      const finalContent = processBold(parts.length > 0 ? parts : [formatted]);

      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={lIdx} className="ml-4 list-disc my-1">
            {finalContent}
          </li>
        );
      }

      if (!line.trim()) {
        return <div key={lIdx} className="h-2" />;
      }

      return <p key={lIdx} className="my-1 leading-relaxed">{finalContent}</p>;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-opacity animate-in fade-in">
      {/* Glassmorphic Container with clean non-broken border */}
      <div
        style={{
          background: "rgba(10, 25, 55, 0.92)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(18px)",
          borderRadius: "20px"
        }}
        className="w-full max-w-2xl shadow-2xl flex flex-col h-[620px] max-h-[90vh] overflow-hidden text-white border-0"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-navy via-navy2 to-blue border-b border-white/10 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <BackButton onClick={onClose} label="Back" className="bg-white/10 text-white border-white/20 hover:bg-white/20" />
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md text-amber-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight text-white flex items-center gap-2">
                Ask Yojana Saathi AI
              </h3>
              <p className="text-xs text-blue-100 font-normal">
                Government Scheme Guidance Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              title="Clear conversation"
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close assistant"
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-900/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : msg.isError
                    ? "bg-red-500 text-white"
                    : "bg-amber-500 text-slate-950 font-bold"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl p-4 text-xs ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white shadow-sm rounded-tr-none"
                    : msg.isError
                    ? "bg-red-950/80 text-red-100 border border-red-500/30 rounded-tl-none"
                    : "bg-white text-slate-900 border border-slate-200 shadow-sm rounded-tl-none"
                }`}
              >
                <div className="text-xs">{renderMarkdown(msg.text)}</div>
                
                <div
                  className={`text-[10px] mt-2 text-right ${
                    msg.sender === "user" ? "text-blue-200" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm text-xs text-slate-600 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span>Yojana Saathi AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts (Chips) */}
        {messages.length <= 2 && !loading && (
          <div className="px-6 py-2 bg-slate-900/60 border-t border-white/10 flex flex-wrap gap-2">
            <span className="text-[11px] font-semibold text-slate-300 w-full block">Suggested questions:</span>
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="text-xs bg-white/10 hover:bg-white/20 text-blue-200 border border-white/15 rounded-full px-3 py-1 text-left transition"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-white/10">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about schemes, eligibility, documents, or benefits..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="flex-1 px-4 py-3 text-xs bg-slate-950 border border-white/15 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-white placeholder-slate-400"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !input.trim()}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-xs font-semibold hover:brightness-110 transition shadow-sm disabled:opacity-50 flex items-center gap-1.5 shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            Yojana Saathi AI provides verified scheme guidance. Formal eligibility matching is performed by the Yojana Saathi Rule Engine.
          </p>
        </div>

      </div>
    </div>
  );
};

export default ChatbotModal;
