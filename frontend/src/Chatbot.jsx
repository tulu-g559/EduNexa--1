import React, { useState, useEffect, useRef } from "react";
import { FaRobot } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { db } from "./firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { toast } from 'react-hot-toast';

const formatText = (text) => {
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/__(.*?)__/g, "<strong>$1</strong>");
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>").replace(/_(.*?)_/g, "<em>$1</em>");
  text = text.replace(/`(.*?)`/g, "<code>$1</code>");
  text = text.replace(/\[([^\[]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-400">$1</a>');
  text = text.replace(/^([*|-])\s(.*)$/gm, "<ul><li>$2</li></ul>");
  text = text.replace(/^\d+\.\s(.*)$/gm, "<ol><li>$1</li></ol>");
  text = text.replace(/^>\s(.*)$/gm, "<blockquote class='text-gray-500 italic'>$1</blockquote>");
  text = text.replace(/^###\s(.*)$/gm, "<h3 class='font-semibold text-lg'>$1</h3>");
  text = text.replace(/\n/g, "<p>$&</p>");
  return text;
};

const Chatbot = () => {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [limit, setLimit] = useState(0);
  const chatEndRef = useRef(null);

  // Fetch limit value from Firestore on component mount
  useEffect(() => {
    if (user) {
      const fetchLimit = async () => {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setLimit(userSnap.data().limit || 0);
          }
        } catch (error) {
          console.error("Error fetching limit:", error);
          toast.error("Error fetching chat limit");
        }
      };

      fetchLimit();
    }
  }, [user]);

  // Load messages from local storage on component mount
  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // Save messages to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const fetchAnswer = async (userQuery) => {
    try {
      const storedMessages = localStorage.getItem("chatMessages");
      let previousConversations = [];
  
      if (storedMessages) {
        const allMessages = JSON.parse(storedMessages);
        previousConversations = allMessages.slice(-10).map(msg => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text
        }));
      }
  
      const response = await fetch("http://localhost:5000/ask-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.uid,
          question: userQuery,
          context: previousConversations,
        }),
      });
  
      const data = await response.json();
      
      // Update limit from backend response
      if (data.remaining_limit !== undefined) {
        setLimit(data.remaining_limit);
      }
  
      return data.answer || "Sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Sorry, something went wrong.";
    }
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;
  
    if (limit <= 0) {
      toast.error("Chat limit exceeded! Play games to earn more credits.");
      return;
    }
  
    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");
    setTyping(true);
  
    // Get AI response and simulate typing
    const aiResponse = await fetchAnswer(input);
    simulateTyping(aiResponse);
  };

  const simulateTyping = (text) => {
    let currentText = "";
    let i = 0;

    const aiMessage = { text: "", sender: "ai" };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);

    const typingInterval = setInterval(() => {
      if (i < text.length) {
        currentText += text.charAt(i);
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          return [
            ...prevMessages.slice(0, -1),
            { ...lastMessage, text: formatText(currentText) },
          ];
        });
        i++;
      } else {
        clearInterval(typingInterval);
        setTyping(false);
      }
    }, 10);
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <div className="flex w-full max-w-5xl h-[80vh] bg-[#0a0a0a] shadow-lg rounded-lg overflow-hidden border border-[#a855f7]">
        <div className="flex flex-col w-full h-full">
          <div className="p-4 bg-[#111] text-white font-semibold text-lg flex items-center gap-2 border-b border-[#a855f7] relative">
            <FaRobot size={20} className="text-[#a855f7]" />
            Edu - Your Personalized AI Tutor
            <div className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-gray-800 p-1 rounded-lg text-center">
              <span className="text-sm font-semibold">Remaining Chats:</span>
              <span className="text-lg font-bold text-green-400"> {limit}</span>
            </div>
          </div>

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
                      ? "bg-[#a855f7] text-white self-end ml-auto"
                      : "bg-[#222] text-gray-300 self-start mr-auto"
                  }`}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              ))
            )}
            <div ref={chatEndRef} />
          </div>

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

      <div className="ml-4 w-1/4 h-[80vh] shadow-lg rounded-lg flex flex-col items-center justify-center p-4">
        <div className="bg-[#222] p-4 rounded-lg shadow-lg text-center">
          <h3 className="text-lg font-bold text-[#a855f7] mb-2">Increase Your Chat Limit</h3>
          <p className="text-sm text-gray-300">
            You can increase your chat limit by playing games in the{" "}
            <span className="text-[#a855f7] font-semibold">Earn Rewards</span> tab.
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default Chatbot;