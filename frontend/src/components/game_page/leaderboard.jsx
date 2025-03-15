import { motion } from "framer-motion";
import { Bot, X } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

export default function Leaderboard() {
  const navigate = useNavigate(); // ✅ Initialize navigate function

  const users = [
    { id: 1, name: "Alice", points: 1200 },
    { id: 2, name: "Bob", points: 1100 },
    { id: 3, name: "Charlie", points: 1000 },
    { id: 4, name: "David", points: 950 },
    { id: 5, name: "Eve", points: 900 },
  ];

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white overflow-y-auto relative">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="absolute top-5 left-5 p-2 bg-yellow-500 hover:bg-yellow-400 rounded-full transition">
        <X className="w-6 h-6 text-black" />
      </button>

      {/* Title */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        className="text-4xl font-bold mb-6"
      >
        🏆 Leaderboard
      </motion.h1>

      {/* Leaderboard List */}
      <div className="w-full max-w-lg">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`p-4 my-2 rounded-lg flex items-center justify-between text-lg shadow-md ${
              index === 0 ? "bg-yellow-500 text-black font-bold" :
              index === 1 ? "bg-gray-400 text-black font-semibold" :
              index === 2 ? "bg-orange-400 text-black font-semibold" :
              "bg-gray-800 text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Bot className="w-6 h-6" />
              <span>{user.name}</span>
            </div>
            <span>{user.points} pts</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
