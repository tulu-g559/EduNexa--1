import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const subjects = [
  { name: "Mathematics", image: "../../../images/Mathematics.jpeg" },
  { name: "Physics", image: "../../../images/Physics.jpeg" },
  { name: "Chemistry", image: "../../../images/Chemistry.jpeg" },
];

export default function SubjectList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white p-8 flex flex-col items-center">
      {/* Title */}
      <h1 className="text-5xl font-extrabold text-center text-purple-400 mb-6 drop-shadow-lg tracking-wide">
        Explore Subjects
      </h1>

      {/* Search Bar */}
      <div className="relative w-full max-w-lg mb-8">
        <input
          type="text"
          placeholder="Search for a subject..."
          className="w-full p-3 pl-12 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:ring-4 focus:ring-purple-500 outline-none transition-all duration-300 shadow-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FaSearch className="absolute left-4 top-3 text-gray-400" />
      </div>

      {/* Subjects Grid */}
      <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
        {filteredSubjects.length > 0 ? (
          filteredSubjects.map((subject, index) => (
            <div
              key={index}
              className="relative bg-gray-900 bg-opacity-60 backdrop-blur-xl p-6 rounded-2xl shadow-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50"
              onClick={() => navigate(`/topics/${subject.name.toLowerCase()}`)}
            >
              <img
                src={subject.image}
                alt={subject.name}
                className="w-full h-48 object-cover rounded-xl border border-gray-700"
              />
              <h2 className="text-3xl font-semibold text-center mt-4 text-white">
                {subject.name}
              </h2>
              {/* Subtle Glow Effect on Hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-all duration-300 bg-purple-500/10 blur-xl"></div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 text-lg col-span-3">
            No subjects found.
          </p>
        )}
      </div>
    </div>
  );
}