import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSearch, FaBookOpen, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const topics = {
  mathematics: ["Algebra", "Calculus", "Geometry"],
  physics: ["Mechanics", "Thermodynamics", "Electromagnetism"],
  chemistry: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"],
};

export default function TopicList() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const topicList = topics[subject] || [];
  const [search, setSearch] = useState("");

  const filteredTopics = topicList.filter((topic) =>
    topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-gray-900 text-white p-8 flex flex-col items-center">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="self-start mb-4 flex items-center text-white bg-gray-700 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600 transition"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <h1 className="text-4xl font-bold text-purple-400 mb-6">
        {subject.charAt(0).toUpperCase() + subject.slice(1)} Topics
      </h1>

      {/* Search Bar */}
      <div className="relative w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Search topics..."
          className="w-full p-3 pl-10 text-white bg-gray-800 ring-2 ring-gray-600 rounded-xl shadow-md outline-none focus:ring-2 focus:ring-purple-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FaSearch className="absolute left-3 top-4 text-gray-500" />
      </div>

      {/* Topic List */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-5 rounded-xl shadow-lg cursor-pointer flex items-center gap-4 transition-transform transform hover:scale-105 hover:bg-purple-600"
              onClick={() => navigate(`/resources/${topic.toLowerCase()}`)}
              whileHover={{ scale: 1.05 }}
            >
              <FaBookOpen className="text-3xl text-purple-300" />
              <h2 className="text-xl font-semibold">{topic}</h2>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-400 text-center w-full">No topics found.</p>
        )}
      </div>
    </div>
  );
}