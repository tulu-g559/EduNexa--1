"use client";

import { useState, useEffect } from "react"; // Add useEffect for fetching point
import { useSelector } from "react-redux"; // For getting user UID
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Gamepad2, CheckSquare, Bot, Gift } from "lucide-react";
import { SparklesCore } from "./components/home_page/sparkles";
import { doc,setDoc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "./firebase/firebase"; // Import your Firestore instance

const cards = [
  { title: "Leaderboard", description: "Compete with others!", icon: Trophy, path: "/leaderboard" },
  { title: "Quiz Battles", description: "Challenge friends in real-time.", icon: Gamepad2, path: "/quiz-battle" },
  { title: "Daily Challenges", description: "Complete tasks and earn rewards!", icon: CheckSquare, path: "/daily-challenges" },
];

export default function GamifiedLearning() {
  const [activeTab, setActiveTab] = useState("activities");
  const [point, setpoint] = useState(0); // State for total reward point
  const [limit, setLimit] = useState(0); // State to store the limit value
  const { user } = useSelector((state) => state.auth); // Get user from Redux

  // Function to fetch point from Firestore
  const fetchpoint = async () => {
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setpoint(userData.point || 0);
          setLimit(userData.limit || 0);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching point:", error);
      }
    }
  };

  // Fetch point when component mounts or user changes
  useEffect(() => {
    fetchpoint();
  }, [user]);

  // Fetch point when the "Earn Rewards" tab is clicked
  useEffect(() => {
    if (activeTab === "rewards") {
      fetchpoint();
    }
  }, [activeTab]);

  const handleRedeemRewards = async (pointRequired, reward) => {
    if (point < pointRequired) {
      alert("Not enough point to redeem this reward!");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { point: point - pointRequired, limit: limit + 10 }, { merge: true });
      setpoint(point - pointRequired); // Update point locally
      alert(`Redeemed ${reward} successfully!`);
    } catch (error) {
      console.error("Error redeeming reward:", error);
      alert("Error redeeming reward!");
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col relative transition-all">
      {/* Background Sparkles */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <SparklesCore particleColor={"#000000"} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative z-10 flex flex-col items-center text-center max-h-[80vh] w-full px-6">
          <RoboAnimation />

          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold mb-6"
          >
            Gamified Learning
          </motion.h1>

          {/* Tab Navigation */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab("activities")}
              className={`px-4 py-2 rounded-lg ${activeTab === "activities" ? "bg-purple-500 text-white" : "bg-gray-700 text-gray-300"}`}
            >
              Activities
            </button>
            <button
              onClick={() => setActiveTab("rewards")}
              className={`px-4 py-2 rounded-lg ${activeTab === "rewards" ? "bg-purple-500 text-white" : "bg-gray-700 text-gray-300"}`}
            >
              Earn Rewards
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "activities" && (
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
          )}

          {activeTab === "rewards" && (
            <div className="flex flex-col items-center w-full max-w-md">
              {/* Total Reward point Display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="mb-4 bg-gray-800 text-white p-3 rounded-lg flex items-center space-x-2 shadow-lg"
              >
                <span className="text-sm font-bold">TOTAL REWARD point</span>
                <span className="text-lg font-bold text-green-400">{point}</span>
              </motion.div>

              {/* Rewards Section */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-yellow-500 p-4 rounded-lg flex flex-col items-center space-y-3 text-black font-bold shadow-lg w-full"
              >
                <Gift className="w-6 h-6" />
                <span>Redeem Your point for Rewards!</span>
                <button
                  onClick={() => handleRedeemRewards(10, "10 free chats")}
                  className="p-2 bg-green-500 rounded-lg hover:bg-green-400 transition w-full"
                >
                  Redeem 10 point for 10 Free Chats
                </button>
                <button
                  onClick={() => handleRedeemRewards(20, "access to study resources")}
                  className="p-2 bg-green-500 rounded-lg hover:bg-green-400 transition w-full"
                >
                  Redeem 20 point for Access to Study Resources
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Robo Animation (unchanged)
function RoboAnimation() {
  return (
    <div className="relative w-full h-[120px] flex justify-center mb-6">
      <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <div className="relative">
          <motion.div
            className="absolute -inset-4 bg-purple-500/20 rounded-full blur-xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <Bot className="w-28 h-28 text-purple-500" />
        </div>
      </motion.div>
    </div>
  );
}