"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const Classroom = () => {
  const [meetingLink, setMeetingLink] = useState("");

  // Redirects user to Google Meet's official room creation page
  const handleCreateRoom = () => {
    window.open("https://meet.google.com/new", "_blank");
  };

  // Redirects user to the entered Google Meet link
  const handleJoinClass = () => {
    if (meetingLink.trim() !== "" && meetingLink.startsWith("https://meet.google.com/")) {
      window.open(meetingLink, "_blank");
    } else {
      alert("Please enter a valid Google Meet link!");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white relative">
      
      {/* Space for Navbar */}
      <div className="h-16 w-full"></div>

      {/* Title */}
      <motion.h1
        className="text-4xl font-bold mb-6 text-blue-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to Your Classroom
      </motion.h1>

      {/* Action Buttons */}
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Create Room Button */}
        <button
          onClick={handleCreateRoom}
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg text-xl shadow-md transition-all"
        >
          Create Room
        </button>

        {/* Join Class Section */}
        <div className="flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="Enter Full Google Meet Link"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            className="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 text-lg outline-none focus:ring-2 focus:ring-blue-400 w-80"
          />
          <button
            onClick={handleJoinClass}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-xl shadow-md transition-all"
          >
            Join Class Now
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Classroom;
