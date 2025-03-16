import React, { useState } from "react";
import { FaRobot } from "react-icons/fa"; // Chatbot icon
import { IoSend } from "react-icons/io5"; // Send icon

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput(""); // Clear input field
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white ">
      <div className="w-full max-w-3xl h-[80vh] bg-[#0a0a0a] shadow-lg flex flex-col rounded-lg overflow-hidden border border-[#a855f7] mt-[-50px]">
        {/* Header */}
        <div className="p-4 bg-[#111] text-white font-semibold text-lg flex items-center gap-2 border-b border-[#a855f7] ">
          <FaRobot size={20} className="text-[#a855f7]" />
          Edu - Your Personalized AI Tutor
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
              <FaRobot size={50} className="mb-4 text-[#a855f7]" />
              <p className="font-medium text-lg">How can I assist you?</p>
              <p className="text-sm">Ask me anything, and I'll do my best to help.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg w-fit ${
                  msg.sender === "user"
                    ? "bg-[#a855f7] text-white self-end"
                    : "bg-[#222] text-gray-300 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))
          )}
        </div>

        {/* Input Field */}
        <div className="p-4 bg-[#111] flex items-center gap-2 border-t border-[#a855f7]">
          <input
            type="text"
            className="flex-1 p-2 bg-[#222] text-white border border-[#a855f7] rounded-lg outline-none focus:ring-2 focus:ring-[#ec4899]"
            placeholder="Ask your Query here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-[#a855f7] text-white px-4 py-2 rounded-lg flex items-center hover:bg-[#ec4899] transition"
            onClick={sendMessage}
          >
            Send <IoSend className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
