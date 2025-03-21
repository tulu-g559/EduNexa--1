import React, { useState, useEffect, useRef } from "react";
import { FaRobot } from "react-icons/fa";
import { IoSend } from "react-icons/io5";


const formatText = (text) => {
  // Bold: **bold** or __bold__
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/__(.*?)__/g, "<strong>$1</strong>");

  // Italics: *italic* or _italic_
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>").replace(/_(.*?)_/g, "<em>$1</em>");

  // Code snippets: `code`
  text = text.replace(/`(.*?)`/g, "<code>$1</code>");

  // Links: [text](url)
  text = text.replace(/\[([^\[]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-400">$1</a>');

  // Unordered List: - item or * item
  text = text.replace(/^([*|-])\s(.*)$/gm, "<ul><li>$2</li></ul>");

  // Ordered List: 1. item
  text = text.replace(/^\d+\.\s(.*)$/gm, "<ol><li>$1</li></ol>");

  // Blockquotes: > blockquote
  text = text.replace(/^>\s(.*)$/gm, "<blockquote class='text-gray-500 italic'>$1</blockquote>");

  // Headers: ### Header
  text = text.replace(/^###\s(.*)$/gm, "<h3 class='font-semibold text-lg'>$1</h3>");

  // Handle paragraph breaks (ensure newlines are converted to <p> tags)
  text = text.replace(/\n/g, "<p>$&</p>");

  return text;
};




const Chatbot = () => {

  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null); // Reference to the bottom of the chat container

  const sendMessage = async () => {
    if (input.trim() === "") return;

    // Add the user's message to the state immediately
    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");
    setTyping(true); // Start typing the AI response

    // Call your API to get the AI response
    const aiResponse = await fetchAnswer(input);

    // Simulate typing the AI's response letter by letter
    simulateTyping(aiResponse);
  };

  const fetchAnswer = async (userQuery) => {
    try {
      const response = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userQuery }),
      });

      const data = await response.json();
      return data.answer || "Sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Sorry, something went wrong.";
    }
  };

  const simulateTyping = (text) => {
    let currentText = "";
    let i = 0;

    // Add AI's message first, then simulate typing letter by letter
    const aiMessage = { text: "", sender: "ai" };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);

    // Simulate typing letter by letter
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        currentText += text.charAt(i);
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          return [
            ...prevMessages.slice(0, -1),
            { ...lastMessage, text: formatText(currentText) }, // Format AI's message before displaying and Update it
          ];
        });
        i++;
      } else {
        clearInterval(typingInterval);
        setTyping(false);
      }
    }, 10); // Adjust typing speed here (in ms)
  };

  // Scroll to the bottom of the chat container whenever messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
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
                className={`mb-5 p-3 rounded-lg w-fit max-w-[90%] ${
                  msg.sender === "user"
                    ? "bg-[#a855f7] text-white self-end ml-auto" // User's message on the right
                    : "bg-[#222] text-gray-300 self-start mr-auto" // AI's message on the left
                }`}
                dangerouslySetInnerHTML={{ __html: msg.text }} // Render HTML content (formatted text)
              />
            ))
          )}

          {/* Empty div that scrolls into view */}
          <div ref={chatEndRef} />
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
