import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Gift, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase"; // Import Firestore database
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";

export default function DailyChallenges() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // ✅ Use Redux to get the user
  const [rewardPoints, setRewardPoints] = useState(0);

  // Fetch reward points from Firebase on component mount
  useEffect(() => {
    if (user) {
      const fetchPoints = async () => {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setRewardPoints(userSnap.data().point || 0);
          }
        } catch (error) {
          console.error("Error fetching reward points:", error);
        }
      };

      fetchPoints();
    }
  }, [user]);

  const [challenges, setChallenges] = useState([
    { id: 1, title: "Answer 5 Questions", progress: 3, total: 5, completed: false },
    { id: 2, title: "Win 3 Rounds", progress: 3, total: 3, completed: true },

  ]);

  // Function to redeem rewards
  const handleRedeemRewards = async (rewardCost, rewardDescription) => {
    if (rewardPoints >= rewardCost) {
      try {
        const newPoints = rewardPoints - rewardCost;
        setRewardPoints(newPoints);

        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          point: newPoints,
        });

        if (rewardDescription === "10 free chats") {
          const userSnap = await getDoc(userRef);
          const currentLimit = userSnap.data().limit || 0;
          await updateDoc(userRef, {
            limit: currentLimit + 10,
          });
        }

        alert(`Reward redeemed successfully! You have received: ${rewardDescription}`);
      } catch (error) {
        console.error("Error updating reward points:", error);
        alert("Failed to redeem rewards. Please try again.");
      }
    } else {
      alert("Not enough reward points to redeem the reward.");
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white overflow-y-auto relative">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="absolute top-5 left-5 p-2 bg-yellow-500 hover:bg-yellow-400 rounded-full transition">
        <X className="w-6 h-6 text-black" />
      </button>

      {/* Total Reward Points in Top Right Corner */}
      <div className="absolute top-5 right-5 bg-gray-800 p-2 rounded-lg text-center">
        <h2 className="text-lg font-semibold">Total Reward Points</h2>
        <p className="text-2xl font-bold text-green-400">{rewardPoints}</p>
      </div>

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
        className="mt-6 bg-yellow-500 p-4 rounded-lg flex flex-col items-center space-y-3 text-black font-bold shadow-lg"
      >
        <Gift className="w-6 h-6" />
        <span>Redeem Your Points for Rewards!</span>
        <button
          onClick={() => handleRedeemRewards(10, "10 free chats")}
          className="p-2 bg-green-500 rounded-lg hover:bg-green-400 transition"
        >
          Redeem 10 Points for 10 Free Chats
        </button>
        <button
          onClick={() => handleRedeemRewards(20, "access to study resources")}
          className="p-2 bg-green-500 rounded-lg hover:bg-green-400 transition"
        >
          Redeem 20 Points for Access to Study Resources
        </button>
      </motion.div>
    </div>
  );
}
