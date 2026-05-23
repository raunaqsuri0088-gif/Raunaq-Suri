import React, { useState, useRef, useEffect } from "react";
import { Sparkles, MessageCircle, X, Send, HelpCircle, Loader } from "lucide-react";
import { Language, User } from "../types";

interface AIChatBotProps {
  currentLanguage: Language;
  currentUser: User | null;
}

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

export default function AIChatBot({ currentLanguage, currentUser }: AIChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Namaste! Welcome to SpiceFlow. I am your B2B culinary and stock assistant advisor. Ask me about custom spice formulations, shelf stability, standard MOQs, or how hotels save 70% preparation labor using roasted onion masala bases."
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { sender: "user", text: userText }],
          userProfile: currentUser
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "My spice mills are slightly congested. Ask me again in 5 seconds." }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Network issue contacting SpiceFlow advisory server. Ensure your GEMINI_API_KEY is configured." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const selectPrePrompt = (txt: string) => {
    setInput(txt);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#F27D26] hover:bg-[#e06b16] text-black rounded-full p-4 hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center border-none cursor-pointer text-sm font-black gap-2"
        >
          <Sparkles className="w-5 h-5 text-black animate-spin" style={{ animationDuration: "3s" }} />
          <span className="hidden sm:inline-block pr-1 font-sans">Ask SpiceFlow AI</span>
        </button>
      )}

      {/* Floating Chat Box Panel */}
      {isOpen && (
        <div className="bg-[#111111] border border-white/10 rounded-2xl w-[320px] sm:w-[400px] h-[480px] shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="bg-[#141414] p-4 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-white/5 rounded-lg p-1.5 border border-white/10">
                <Sparkles className="w-4 h-4 text-[#F27D26] animate-pulse" />
              </div>
              <div className="text-left leading-none">
                <span className="text-xs font-black text-white">SpiceFlow AI Assistant</span>
                <span className="block text-[8px] font-mono text-[#F27D26] mt-0.5">Milling & Yields Advisor</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages list */}
          <div className="p-4 flex-1 overflow-x-hidden overflow-y-auto space-y-4 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-left leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[#F27D26] text-black rounded-tr-none font-bold shadow-md"
                      : "bg-[#141414] border border-white/10 text-stone-200 rounded-tl-none whitespace-pre-wrap"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#141414] border border-white/10 text-stone-400 rounded-2xl rounded-tl-none px-3.5 py-2.5 flex items-center space-x-2 font-mono">
                  <Loader className="w-4 h-4 animate-spin text-[#F27D26]" />
                  <span>Milling advice response...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Preconfigured preps shortcuts */}
          <div className="px-4 py-2 border-t border-white/5 bg-[#0A0A0A] flex flex-wrap gap-1.5 animate-fade-in">
            {[
              "Calculate labor savings",
              "Shelf life instructions",
              "How is MOQ configured?",
            ].map((shortcut) => (
              <button
                key={shortcut}
                onClick={() => selectPrePrompt(shortcut)}
                className="text-[9.5px] font-mono bg-white/5 border border-white/10 text-stone-400 rounded px-2.5 py-1 text-left cursor-pointer hover:border-[#F27D26]/40 hover:text-[#F27D26] transition-all"
              >
                {shortcut}
              </button>
            ))}
          </div>

          {/* Form input */}
          <form onSubmit={handleSubmit} className="p-3 bg-[#141414] border-t border-white/10 flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask SpiceFlow AI Advisor..."
              className="flex-grow bg-[#0A0A0A] border border-white/15 rounded-xl px-3.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#F27D26]"
            />
            <button
              type="submit"
              className="bg-[#F27D26] hover:bg-[#e06b16] text-black rounded-xl p-2.5 flex items-center justify-center cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
