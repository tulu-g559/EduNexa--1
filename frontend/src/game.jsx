"use client";

import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Trophy, Gamepad2, CheckSquare, Bot } from "lucide-react";
import { SparklesCore } from "./components/home_page/sparkles";

const cards = [
  { title: "Leaderboard", description: "Compete with others!", icon: Trophy, path: "/leaderboard" },
  { title: "Quiz Battles", description: "Challenge friends in real-time.", icon: Gamepad2, path: "/quiz-battle" },
  { title: "Daily Challenges", description: "Complete tasks and earn rewards!", icon: CheckSquare, path: "/daily-challenges" },
];

export default function GamifiedLearning() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`h-screen overflow-hidden flex flex-col relative transition-all ${darkMode ? "bg-black text-white" : "bg-gray-100 text-black"}`}>
      
      {/* Background Sparkles */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <SparklesCore particleColor={darkMode ? "#FFFFFF" : "#000000"} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative z-10 flex flex-col items-center text-center max-h-[80vh] w-full px-6">
          <RoboAnimation />

          <motion.h1 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl font-bold mb-6">
            Gamified Learning
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-gray-900 text-white dark:bg-gray-700 rounded-xl shadow-md flex items-center space-x-4 cursor-pointer"
              >
                <Link to={card.path} className="flex items-center space-x-4">
                  <card.icon className="w-10 h-10 text-yellow-400" />
                  <div>
                    <h2 className="text-lg font-semibold">{card.title}</h2>
                    <p className="text-sm opacity-75">{card.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Robo Animation
function RoboAnimation() {
  return (
    <div className="relative w-full h-[120px] flex justify-center mb-6">
      <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <div className="relative">
          <motion.div className="absolute -inset-4 bg-purple-500/20 rounded-full blur-xl" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
          <Bot className="w-28 h-28 text-purple-500" />
        </div>
      </motion.div>
    </div>
  );
}
