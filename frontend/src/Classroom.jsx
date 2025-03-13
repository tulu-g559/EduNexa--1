"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SparklesCore } from "./components/home_page/sparkles";

const Classroom = () => {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`h-screen overflow-hidden flex flex-col relative transition-all ${darkMode ? "bg-black text-white" : "bg-gray-100 text-black"}`}>
      
      {/* Background Sparkles */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <SparklesCore particleColor={darkMode ? "#FFFFFF" : "#000000"} />
      </div>

      {/* Classroom Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-h-[80vh] w-full px-6 justify-center">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold mb-6"
          >
            Welcome to Your Classroom
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-lg mb-6 text-gray-200"
          >
            Join your live sessions and explore interactive learning with your teachers and peers.
          </motion.p>

          <motion.a
            href="https://meet.google.com/xyz-abc-123"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            Join Class Now
          </motion.a>
        </motion.div>

        {/* Classroom Details Card */}
        <motion.div
          className="bg-gray-800 rounded-lg shadow-lg py-4 px-8 mt-7 mx-auto w-full max-w-xl flex justify-center items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Inner Container for Centered Content */}
          <div className="space-y-6 w-full">
            
            {/* Class Information */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Class Details</h2>
              <div className="space-y-4 text-gray-200">
                <div>
                  <span className="font-medium">Class Name:</span> 
                  <span>Intro to React</span>
                </div>
                <div>
                  <span className="font-medium">Time:</span> 
                  <span>10:00 AM - 12:00 PM</span>
                </div>
                <div>
                  <span className="font-medium">Date:</span> 
                  <span>March 13, 2025</span>
                </div>
              </div>
            </motion.div>

            {/* Teacher Information */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Teacher Info</h2>
              <div className="space-y-4 text-gray-200">
                <div>
                  <span className="font-medium">Teacher:</span> 
                  <span>John Doe</span>
                </div>
                <div>
                  <span className="font-medium">Email:</span> 
                  <span>john.doe@example.com</span>
                </div>
                <div>
                  <span className="font-medium">Phone:</span> 
                  <span>(123) 456-7890</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Classroom;
