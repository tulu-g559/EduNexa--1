import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Hero from "./components/home_page/hero";
import Navbar from "./components/home_page/navbar";
import { SparklesCore } from "./components/home_page/sparkles";
import Game from "./game.jsx";
import QuizBattle from "./components/game_page/QuizBattle.jsx";
import Leaderboard from "./components/game_page/leaderboard.jsx";
import DailyChallenges from "./components/game_page/DailyChallenges.jsx";
import NotFound from "./components/404/404.jsx";
import UnderConstruction from "../src/components/404/UnderConstruction.jsx";
import Classroom from "./Classroom.jsx";

export default function App() {
  const location = useLocation(); // Get the current route
  const [backendMessage, setBackendMessage] = useState("");

  // Fetch a test API from Flask backend
  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/hello")
      .then((res) => res.json())
      .then((data) => setBackendMessage(data.message))
      .catch((err) => console.error("Error connecting to backend:", err));
  }, []);

  return (
    <>
      <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
        {/* Ambient background with moving particles */}
        <div className="h-full w-full absolute inset-0 z-0">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>

        <div className="relative z-10">
          {/* Show Navbar only if NOT on 404 or under-construction page */}
          {!["/404", "/under-construction"].includes(location.pathname) && <Navbar />}

          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/game" element={<Game />} />
            <Route path="/quiz-battle" element={<QuizBattle />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/daily-challenges" element={<DailyChallenges />} />
            <Route path="/under-construction" element={<UnderConstruction />} />
            <Route path="/classroom" element={<Classroom />} />
            
            <Route path="/404" element={<NotFound />} />
            {/* Catch all other routes and redirect to 404 */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>

          {/* Show backend connection status */}
          <div className="text-center mt-4 text-white">
            {backendMessage && <p>🚀 Backend: {backendMessage}</p>}
          </div>
        </div>
      </main>
    </>
  );
}

