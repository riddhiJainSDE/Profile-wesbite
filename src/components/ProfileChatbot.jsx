import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, MessageSquare } from "lucide-react";
import { getChatReply } from "../services/chat";
import welcomeGif from "../assets/download (1).gif";
import videoBg from "../assets/video.mp4"; 

// Custom styles to define the semi-transparent background for the chat content areas
const CustomStyles = () => (
    <style dangerouslySetInnerHTML={{__html: `
        /* Opacity set to 0.6: 40% transparency for the background sheet */
        .bg-content-transparent { background-color: rgba(22, 27, 34, 0.6); }
        /* Define other colors for consistency */
        .border-github-border { border-color: #30363d; }
        .text-github-text { color: #c9d1d9; }
        .bg-github-accent { background-color: #2f81f7; }
        /* Ensure message bubble background is solid for readability */
        .bg-chat-bubble { background-color: #161b22; }
    `}} />
);

const ProfileChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartChat = () => {
    setChatStarted(true);
    setMessages([
      {
        role: "bot",
        text: "👋 Hi! I'm Riddhi's AI assistant. Ask me anything about her background, skills, or projects!",
      },
    ]);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newUserMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);

    try {
      const reply = await getChatReply(input);
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Error: Could not process your message." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const MessageBubble = ({ message }) => (
    <div
      className={`flex mb-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`p-3 max-w-[85%] lg:max-w-[60%] rounded-xl shadow-lg break-words transition-all ${
          message.role === "user"
            ? "bg-github-accent text-white rounded-br-none"
            : "bg-chat-bubble border border-github-border text-github-text rounded-tl-none"
        }`}
      >
        <div className="flex items-center text-xs font-semibold mb-1">
          {message.role === "bot" ? (
            <Bot className="w-4 h-4 mr-1 text-github-accent" />
          ) : (
            <User className="w-4 h-4 mr-1 text-white" />
          )}
          {message.role === "bot" ? "Assistant" : "You"}
        </div>
        <p
          className="whitespace-pre-wrap text-sm"
          dangerouslySetInnerHTML={{
            __html: message.text
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/\n/g, "<br/>"),
          }}
        ></p>
      </div>
    </div>
  );

  return (
    // Outer container for centering (solid dark background)
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0d1117]">
      <CustomStyles />
      
      {/* Main chat container: RELATIVE to contain the video, and uses solid black background as fallback */}
      <div className="relative z-10 flex flex-col h-[90vh] w-full max-w-3xl lg:max-w-5xl mx-auto shadow-2xl rounded-2xl overflow-hidden bg-[#000]">
        
        {/* --- VIDEO BACKGROUND LAYER --- */}
        <video
          className="absolute inset-0 object-cover w-full h-full z-0"
          src={videoBg}
          autoPlay
          loop
          muted
        />
        {/* Transparent Sheet: This is the actual layer where all content sits */}
        <div className="absolute inset-0 z-10 flex flex-col bg-content-transparent">
        
        {!chatStarted ? (
          // WELCOME SCREEN CONTENT
          <div className="flex flex-col lg:flex-row items-center justify-center flex-grow text-center p-8 lg:p-16 space-y-8 lg:space-y-0 lg:space-x-12">
            
            {/* Circular GIF container */}
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-github-accent shadow-xl transition-all duration-300 flex-shrink-0">
              <img
                src={welcomeGif}
                alt="Welcome Animation"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text and Button Group */}
            <div className="flex flex-col items-center lg:items-start space-y-4 max-w-md">
              <h2 className="text-3xl font-bold text-github-text">
                Meet Riddhi’s AI Assistant 🤖
              </h2>
              <p className="text-base text-gray-400">
                Ask about her projects, skills, experience, achievements, and more!
              </p>
              <button
                onClick={handleStartChat}
                className="mt-4 px-10 py-3 bg-github-accent text-white font-bold rounded-full shadow-lg hover:bg-github-accent/90 transition transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageSquare className="w-5 h-5 inline mr-2"/> Start Chat
              </button>
            </div>
          </div>
        ) : (
          // CHAT SCREEN CONTENT
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-github-border flex items-center sticky top-0 z-20">
              <Bot className="w-6 h-6 mr-2 text-github-accent" />
              <h2 className="text-xl font-semibold text-github-text">
                Riddhi Assistant
              </h2>
            </div>
            
            {/* Chat messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-2">
              {messages.map((msg, idx) => (
              <MessageBubble key={idx} message={msg} />
              ))}
              {loading && (
              <div className="flex justify-start mb-3">
                  <div className="p-3 border border-github-border rounded-xl shadow-lg bg-content-transparent">
                  <Loader2 className="w-5 h-5 animate-spin text-github-accent" />
                  </div>
              </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input box */}
            <div className="flex p-4 border-t border-github-border space-x-2">
              <input
              type="text"
              className="flex-grow p-3 rounded-xl border border-github-border bg-content-transparent text-github-text placeholder-gray-500 focus:ring-2 focus:ring-github-accent focus:outline-none"
              placeholder={
                  loading
                  ? "Waiting for response..."
                  : "Ask me anything about Riddhi..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              />
              <button
              className={`p-3 rounded-xl flex items-center justify-center transition ${
                  loading || !input.trim()
                  ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                  : "bg-github-accent text-white hover:bg-github-accent/80"
              }`}
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              >
              {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                  <Send className="w-5 h-5" />
              )}
              </button>
            </div>
          </>
        )}
        </div> {/* End of the main content sheet */}
      </div> {/* End of the main chat container */}
    </div>
  );
};

export default ProfileChatbot;