import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { score } = location.state || { score: 0 }; // Default score is 0 if not provided

  // Button to restart the quiz or go home
  const handleRestart = () => {
    navigate("/quiz-battle"); // Go back to quiz page
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      {/* Results Header */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-semibold mb-6"
      >
        Quiz Results
      </motion.h1>

      {/* Player Score */}
      <div className="bg-gray-800 p-6 rounded-lg text-center mb-8">
        <h2 className="text-lg font-semibold">Your Score</h2>
        <p className="text-3xl font-bold text-yellow-400">{score}</p>
      </div>

      {/* Message Based on Score */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900 p-6 rounded-lg shadow-lg text-center w-full max-w-lg mb-8"
      >
        <h3 className="text-2xl font-semibold">
          {score > 0 ? "Congratulations!" : "Better luck next time!"}
        </h3>
        <p className="mt-2 text-xl">
          {score > 0
            ? "You did a great job!"
            : "Don't worry, try again to improve your score!"}
        </p>
      </motion.div>

      {/* Restart or Go Home Button */}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={handleRestart}
          className="p-3 bg-green-500 rounded-lg hover:bg-green-400 transition"
        >
          Restart Quiz
        </button>
        <button
          onClick={() => navigate("/")}
          className="p-3 bg-yellow-500 rounded-lg hover:bg-yellow-400 transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}