import React from "react";
import { useNavigate } from "react-router-dom";


const subjects = [
  { name: "Mathematics", image: "../../../images/Mathematics.jpeg" },
  { name: "Physics", image: "../../../images/Physics.jpeg" },
  { name: "Chemistry", image: "../../../images/Chemistry.jpeg" },
];

export default function SubjectList() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-center text-purple-400">
        Select a Subject
      </h1>
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {subjects.map((subject, index) => (
          <div
            key={index}
            className="bg-gray-900 text-white p-4 rounded-xl shadow-lg cursor-pointer transition hover:scale-105"
            onClick={() => navigate(`/topics/${subject.name.toLowerCase()}`)}
          >
            <img src={subject.image} alt={subject.name} className="w-full h-40 object-cover rounded-md"/>
            <h2 className="text-2xl font-semibold text-center mt-2">{subject.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
