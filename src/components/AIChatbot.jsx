import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageCircle, X, Send, Loader2, Bot, User, Trash2 } from "lucide-react";

const chatApiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || ""
).replace(/\/$/, "");

const INITIAL_MESSAGES = [
  { role: "assistant", content: "Hi 👋 How can I help you today?" }
];

const getStoredToken = () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return userInfo?.token || "";
  } catch {
    return "";
  }
};

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingMessage]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // ✅ NEW: Clear chat logic
  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInput("");
    setTypingMessage("");
    setIsLoading(false);
  };

  const typeMessage = (text, index = 0) => {
    if (index < text.length) {
      setTypingMessage(text.substring(0, index + 1));
      setTimeout(() => typeMessage(text, index + 1), 20);
    } else {
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
      setTypingMessage("");
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const token = getStoredToken();

    if (!token) {
      typeMessage("Your session has expired. Please log in again to use the AI assistant.");
      return;
    }

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${chatApiBaseUrl}/ai/chat`,
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      typeMessage(res?.data?.reply || "Sorry, I couldn't process that request.");
    } catch (error) {
      console.error("AI chat request failed", error);
      typeMessage(
        error.response?.status === 403
          ? "You are not authorized to use the AI assistant. Please log in again."
          : "Sorry, I'm having trouble connecting. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-[#0d1117] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 group animate-pulse-slow"
        aria-label="Chat with AI Assistant"
      >
        {open ? (
          <X size={24} className="group-hover:rotate-90 transition-transform" />
        ) : (
          <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="z-10 fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-slide-up">

          {/* ✅ UPDATED Header — clear button added */}
          <div className="bg-gradient-to-r from-[#461792] to-purple-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-white/80">Always here to help</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Clear Chat Button */}
              <button
                onClick={clearChat}
                title="Clear chat"
                className="hover:bg-white/20 p-1.5 rounded-lg transition"
                aria-label="Clear chat history"
              >
                <Trash2 size={17} />
              </button>

              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                className="hover:bg-white/20 p-1.5 rounded-lg transition"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-start gap-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-blue-100 text-[#461792]"
                      : "bg-purple-100 text-purple-600"
                  }`}>
                    {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
                  </div>

                  <div
                    className={`p-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-[#7448bb] to-purple-400 text-white rounded-tr-none"
                        : "bg-white text-gray-800 rounded-tl-none shadow-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <span className="text-[10px] opacity-70 mt-1 block">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {typingMessage && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="p-3 rounded-2xl bg-white text-gray-800 rounded-tl-none shadow-sm">
                    <p className="text-sm">{typingMessage}</p>
                    <span className="text-[10px] opacity-70 mt-1 block">Typing...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full p-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none max-h-32 min-h-[44px]"
                  rows="1"
                  disabled={isLoading}
                />
                {isLoading && (
                  <div className="absolute right-3 bottom-3">
                    <Loader2 size={18} className="animate-spin text-gray-400" />
                  </div>
                )}
              </div>

              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className={`p-3 rounded-xl transition-all ${
                  !input.trim() || isLoading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#461792] to-purple-500 text-white hover:scale-105 shadow-md"
                }`}
              >
                <Send size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-2 text-center">
              Press Enter to send • Shift + Enter for new line
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 2s infinite; }
      `}</style>
    </>
  );
};

export default AIChatbot;