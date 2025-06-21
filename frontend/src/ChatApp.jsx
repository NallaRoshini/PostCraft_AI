import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { Logo } from "./Logo";

function ChatBubble({ sender, text, isFirstBotMessage }) {
  const isUser = sender === "user";
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy.");
    }
  };
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
    <div>
      <div
        className={`max-w-xl px-5 py-3 rounded-lg shadow-md text-sm leading-relaxed whitespace-pre-wrap
          ${isUser ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-100 text-gray-900 rounded-bl-none"}`}
      >
        {text}
      </div>
      {!isUser && !isFirstBotMessage && (
          <button onClick={handleCopy} className="mt-1 ml-2">
            <img
              src="/copy_icon.png" // Using public path
              alt="Copy"
              className="w-5 h-5 hover:opacity-80 transition duration-150"
            />
          </button>
        )}
      </div>
    </div>
  );
}

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
  if (user) {
    const fullName = `${user.firstName} ${user.lastName}`;
    setMessages([
      {
        sender: "bot",
        text: `Hi ${fullName}! What would you like a LinkedIn post about today?`,
      },
    ]);
  }
}, [user]);
  
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("https://postcraft-ai-1.onrender.com/chat", {
        message: input,
      });

      const fullResponse = res.data.response;
    let botText = "";
    setMessages((prev) => [...prev, { sender: "bot", text: "" }]); // Add empty bubble

    let charIndex = 0;
    const interval = setInterval(() => {
      if (charIndex < fullResponse.length) {
        botText += fullResponse[charIndex];
        charIndex++;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { sender: "bot", text: botText };
          return updated;
        });
      } else {
        clearInterval(interval);
        setLoading(false);
      }
    }, 20); // 20ms per character = adjustable typing speed
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Error generating post. Please try again." },
      ]);
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 to-white flex justify-center items-center">
  <div className="w-[700px] h-[90vh] flex flex-col shadow-xl border border-gray-200 rounded-3xl overflow-hidden bg-white">
        <div className="bg-white py-5 px-8 flex items-center justify-between border-b">
          <div>
          <div className="flex gap-2 align-baseline">
            <Logo/>
            <h1 className="text-2xl font-extrabold text-indigo-700 flex items-center gap-2">
            PostCraft <span className="text-indigo-500"> AI</span>
            </h1>
          </div>
            <div className="text-sm text-gray-400 font-medium">Craft impactful posts effortlessly</div>
          </div>
            <div className="text-right text-sm">
              <button onClick={logout} className="mx-auto block w-20 bg-white text-indigo-700 py-2 rounded-lg border-1 border-indigo-700 hover:bg-indigo-700 hover:text-white transition duration-200">Log Out</button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 bg-white">
          {messages.map((msg, idx) => (
            <ChatBubble
              key={idx}
              sender={msg.sender}
              text={msg.text}
              isFirstBotMessage={msg.sender === "bot" && idx === 0}
            />
          ))}
          {loading && (
            <div className="flex items-center gap-1 mt-2 px-3">
            <span className="bounce-dot"></span>
            <span className="bounce-dot"></span>
            <span className="bounce-dot"></span>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Write a post about Career Growth in English..."
          />
          <button
            onClick={sendMessage}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold shadow"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
