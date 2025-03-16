import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const topics = {
  mathematics: ["Algebra", "Calculus", "Geometry"],
  physics: ["Mechanics", "Thermodynamics", "Electromagnetism"],
  chemistry: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"],
};

export default function TopicList() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const topicList = topics[subject] || [];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-center text-purple-400">
        {subject.charAt(0).toUpperCase() + subject.slice(1)} Topics
      </h1>
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {topicList.map((topic, index) => (
          <div
            key={index}
            className="bg-gray-800 p-4 rounded-xl shadow-md cursor-pointer transition hover:bg-purple-600"
            onClick={() => navigate(`/resources/${subject}/${topic.toLowerCase()}`)}
          >
            <h2 className="text-2xl font-semibold text-center">{topic}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
