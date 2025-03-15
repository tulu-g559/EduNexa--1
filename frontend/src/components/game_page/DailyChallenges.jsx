import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Gift, X } from "lucide-react";
import { useNavigate } from "react-router-dom"; 

export default function DailyChallenges() {
  const navigate = useNavigate(); 

  const [challenges, setChallenges] = useState([
    { id: 1, title: "Answer 5 Questions", progress: 3, total: 5, completed: false },
    { id: 2, title: "Win 3 Rounds", progress: 3, total: 3, completed: true },
    { id: 3, title: "Score 50 Points", progress: 25, total: 50, completed: false },
  ]);

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
        className="text-3xl font-bold mb-6"
      >
        🌟 Daily Challenges
      </motion.h1>

      {/* Challenge List */}
      <div className="w-full max-w-lg space-y-4">
        {challenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`p-4 rounded-lg shadow-lg relative ${challenge.completed ? "bg-green-600" : "bg-gray-800"}`}
          >
            {/* Challenge Title */}
            <h2 className="text-lg font-semibold">{challenge.title}</h2>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 h-3 rounded-full mt-2">
              <div className={`h-full ${challenge.completed ? "bg-yellow-400" : "bg-blue-500"} rounded-full transition-all`} 
                   style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}>
              </div>
            </div>

            {/* Progress Text */}
            <p className="text-sm mt-2">{challenge.progress}/{challenge.total}</p>

            {/* Completion Icon */}
            {challenge.completed && <CheckCircle className="absolute top-2 right-2 text-yellow-400 w-6 h-6" />}
          </motion.div>
        ))}
      </div>

      {/* Rewards Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mt-6 bg-yellow-500 p-4 rounded-lg flex items-center space-x-3 text-black font-bold shadow-lg"
      >
        <Gift className="w-6 h-6" />
        <span>Complete all challenges to earn rewards!</span>
      </motion.div>
    </div>
  );
}
