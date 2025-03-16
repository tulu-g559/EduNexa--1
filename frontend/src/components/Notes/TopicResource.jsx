import React from "react";
import { useParams } from "react-router-dom";
import { FaBook, FaFilePdf, FaYoutube } from "react-icons/fa";

const resources = {
  algebra: {
    pdf: "/assets/algebra_notes.pdf",
    youtube: "https://youtube.com/algebra_tutorials",
    article: "https://example.com/algebra_article",
  },
  mechanics: {
    pdf: "/assets/mechanics_notes.pdf",
    youtube: "https://youtube.com/mechanics_tutorials",
    article: "https://example.com/mechanics_article",
  },
  organicchemistry: {
    pdf: "/assets/organic_notes.pdf",
    youtube: "https://youtube.com/organic_tutorials",
    article: "https://example.com/organic_article",
  },
};

export default function TopicResource() {
  const { topic } = useParams();
  const data = resources[topic.toLowerCase()] || {};

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-center text-purple-400">
        {topic.charAt(0).toUpperCase() + topic.slice(1)} Resources
      </h1>
      <div className="flex flex-col items-center gap-4 mt-6">
        <a href={data.pdf} className="bg-red-500 hover:bg-red-700 p-3 rounded-md text-white flex items-center gap-2">
          <FaFilePdf /> Download PDF
        </a>
        <a href={data.youtube} className="bg-blue-500 hover:bg-blue-700 p-3 rounded-md text-white flex items-center gap-2">
          <FaYoutube /> Watch Video
        </a>
        <a href={data.article} className="bg-green-500 hover:bg-green-700 p-3 rounded-md text-white flex items-center gap-2">
          <FaBook /> Read Article
        </a>
      </div>
    </div>
  );
}
