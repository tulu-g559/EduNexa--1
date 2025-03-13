import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

export default function QuizBattle({ onBack }) {
  const [question, setQuestion] = useState(null);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);

  // Sample Question Data (Replace with API later)
  const quizData = {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    correct: "Paris",
  };

  // Countdown Timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Handle Answer Selection
  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (answer === quizData.correct) {
      setScore((prev) => ({ ...prev, player1: prev.player1 + 10 }));
    }
    setTimeout(() => {
      setSelectedAnswer(null);
      setTimeLeft(10); // Reset Timer for Next Question
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white relative p-4">
      {/* Back Button */}
      <button onClick={onBack} className="absolute top-5 left-5 p-2 bg-yellow-500 hover:bg-yellow-400 rounded-full transition">
        <XCircle className="w-6 h-6 text-black" />
      </button>

      {/* Title */}
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-3xl font-bold mb-6">
        ⚔️ Quiz Battle
      </motion.h1>

      {/* Scoreboard */}
      <div className="flex justify-between w-full max-w-lg mb-6">
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <h2 className="text-lg font-semibold">Player 1</h2>
          <p className="text-xl font-bold text-yellow-400">{score.player1}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <h2 className="text-lg font-semibold">Player 2</h2>
          <p className="text-xl font-bold text-blue-400">{score.player2}</p>
        </div>
      </div>

      {/* Countdown Timer */}
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="text-2xl font-bold text-red-400 mb-4">
        ⏳ {timeLeft}s
      </motion.div>

      {/* Question Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900 p-6 rounded-lg shadow-lg text-center w-full max-w-lg"
      >
        <h2 className="text-xl font-semibold mb-4">{quizData.question}</h2>

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-4">
          {quizData.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswer(option)}
              whileTap={{ scale: 0.9 }}
              className={`p-3 rounded-lg font-semibold ${
                selectedAnswer === option
                  ? option === quizData.correct
                    ? "bg-green-500 text-black"
                    : "bg-red-500 text-black"
                  : "bg-gray-700 text-black"
              }`}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
