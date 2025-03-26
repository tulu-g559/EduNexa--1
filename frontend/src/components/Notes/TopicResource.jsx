import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaBook, FaFilePdf, FaYoutube, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const resources = {
  algebra: {
    pdf: "/assets/algebra_notes.pdf",
    youtube: "https://youtube.com/algebra_tutorials",
    article: "https://example.com/algebra_article",
  },
  calculus: {
    pdf: "/assets/algebra_notes.pdf",
    youtube: "https://youtube.com/algebra_tutorials",
    article: "https://example.com/algebra_article",
  },
  geometry: {
    pdf: "/assets/algebra_notes.pdf",
    youtube: "https://youtube.com/algebra_tutorials",
    article: "https://example.com/algebra_article",
  },
  mechanics: {
    pdf: "/assets/mechanics_notes.pdf",
    youtube: "https://youtube.com/mechanics_tutorials",
    article: "https://example.com/mechanics_article",
  },
  thermodynamics: {
    pdf: "/assets/algebra_notes.pdf",
    youtube: "https://youtube.com/algebra_tutorials",
    article: "https://example.com/algebra_article",
  },
  electromagnetism: {
    pdf: "/assets/algebra_notes.pdf",
    youtube: "https://youtube.com/algebra_tutorials",
    article: "https://example.com/algebra_article",
  },
  "organic chemistry": {
    pdf: "/assets/organic_notes.pdf",
    youtube: "https://youtube.com/organic_tutorials",
    article: "https://example.com/organic_article",
  },
  "inorganic chemistry": {
    pdf: "/assets/algebra_notes.pdf",
    youtube: "https://youtube.com/algebra_tutorials",
    article: "https://example.com/algebra_article",
  },
  "physical chemistry": {
    pdf: "/assets/algebra_notes.pdf",
    youtube: "https://youtube.com/algebra_tutorials",
    article: "https://example.com/algebra_article",
  },
};

export default function TopicResource() {
  const { topic } = useParams();
  const navigate = useNavigate();
  const data = resources[topic.toLowerCase()] || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-8 flex flex-col items-center">
      
      {/* Back Button */}
      <motion.button
        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg mb-6 transition transform hover:scale-105"
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.1 }}
      >
        <FaArrowLeft size={18} />
        <span>Back to Topics</span>
      </motion.button>

      {/* Title */}
      <motion.h1
        className="text-5xl font-bold text-center text-purple-400 mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {topic.charAt(0).toUpperCase() + topic.slice(1)} Resources
      </motion.h1>

      {/* Resources Grid */}
      <motion.div
        className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        {data.pdf && (
          <motion.a
            href={data.pdf}
            className="bg-red-500 hover:bg-red-700 p-4 rounded-xl text-white flex flex-col items-center gap-2 shadow-lg transition transform hover:scale-105"
            whileHover={{ scale: 1.1 }}
          >
            <FaFilePdf size={40} />
            <span>Download PDF</span>
          </motion.a>
        )}
        {data.youtube && (
          <motion.a
            href={data.youtube}
            className="bg-blue-500 hover:bg-blue-700 p-4 rounded-xl text-white flex flex-col items-center gap-2 shadow-lg transition transform hover:scale-105"
            whileHover={{ scale: 1.1 }}
          >
            <FaYoutube size={40} />
            <span>Watch Video</span>
          </motion.a>
        )}
        {data.article && (
          <motion.a
            href={data.article}
            className="bg-green-500 hover:bg-green-700 p-4 rounded-xl text-white flex flex-col items-center gap-2 shadow-lg transition transform hover:scale-105"
            whileHover={{ scale: 1.1 }}
          >
            <FaBook size={40} />
            <span>Read Article</span>
          </motion.a>
        )}
      </motion.div>
    </div>
  );
}