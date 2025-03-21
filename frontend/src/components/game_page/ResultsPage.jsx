import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase"; // Import Firestore database
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";

export default function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user); // Use Redux to get the user
  const { score } = location.state || { score: 0 }; // Default score is 0 if not provided

  const [rewardPoints, setRewardPoints] = useState(0);

  // Retrieve and update reward points in Firestore
  useEffect(() => {
    const updatePoints = async () => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          const storedPoints = userSnap.exists() ? userSnap.data().point || 0 : 0;
          const newTotal = storedPoints + score;
          setRewardPoints(newTotal);

          await updateDoc(userRef, {
            point: newTotal,
          });
        } catch (error) {
          console.error("Error updating reward points in Firestore:", error);
        }
      }
    };

    updatePoints();
  }, [score, user]);

  // Restart Quiz
  const handleRestart = () => {
    navigate("/quiz-battle"); // Go back to quiz page
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white p-4 relative">
      {/* Total Reward Points in Top Right Corner */}
      <div className="absolute top-4 right-4 bg-gray-800 p-2 rounded-lg text-center">
        <h2 className="text-lg font-semibold">Total Reward Points</h2>
        <p className="text-2xl font-bold text-green-400">{rewardPoints}</p>
      </div>

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
      <div className="bg-gray-800 p-6 rounded-lg text-center mb-4">
        <h2 className="text-lg font-semibold">Your Score</h2>
        <p className="text-3xl font-bold text-yellow-400">{score}</p>
      </div>

      {/* Reward Points */}
      <div className="bg-gray-700 p-6 rounded-lg text-center mb-8">
        <h2 className="text-lg font-semibold">Total Reward Points</h2>
        <p className="text-3xl font-bold text-green-400">{rewardPoints}</p>
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