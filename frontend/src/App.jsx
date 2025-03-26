import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { auth } from "./firebase/firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginFailure, logout } from "./redux/authSlice.js";
import { toast } from "react-hot-toast";

import Hero from "./components/home_page/hero";
import Navbar from "./components/home_page/navbar";
import { SparklesCore } from "./components/home_page/sparkles";
import Game from "./game.jsx";
import About from "./components/home_page/About.jsx";
import QuizBattle from "./components/game_page/QuizBattle.jsx";
import Leaderboard from "./components/game_page/leaderboard.jsx";
import DailyChallenges from "./components/game_page/DailyChallenges.jsx";
import NotFound from "./components/404/404.jsx";
import UnderConstruction from "./components/404/UnderConstruction.jsx";
import Classroom from "./Classroom.jsx";
import SubjectList from "./components/Notes/SubjectList.jsx";
import TopicList from "./components/Notes/TopicList.jsx";
// import TopicResource from "./components/Notes/TopicResource.jsx";
import Auth from "./components/home_page/Auth.jsx";
import Chatbot from "./Chatbot.jsx";
import ResultsPage from "./components/game_page/ResultsPage.jsx";
import GetHints from "./components/Notes/Get_hints.jsx"; // Import the new component

export default function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(loginSuccess(currentUser));
      } else if (user !== null) {
        toast.success("Logout successful!", { duration: 1000 });
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch, user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out!");
      dispatch(loginFailure(error.message));
    }
  };

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      toast.error("Please log in first!", { duration: 1000 });
      return <Navigate to="/" replace />;
    }
    return children;
  };

  const RedirectIfLoggedIn = ({ children }) => {
    if (user) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
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
        {location.pathname !== "/404" && (
          <Navbar user={user} onLogout={handleLogout} />
        )}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Hero />} />
          <Route path="/home" element={<Hero />} />
          <Route path="/about" element={<About />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />

          {/* Prevent access to login/signup if logged in */}
          <Route
            path="/login"
            element={
              <RedirectIfLoggedIn>
                <Auth isLogin={true} />
              </RedirectIfLoggedIn>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectIfLoggedIn>
                <Auth isLogin={false} />
              </RedirectIfLoggedIn>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <Game />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz-battle"
            element={
              <ProtectedRoute>
                <QuizBattle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <ResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/daily-challenges"
            element={
              <ProtectedRoute>
                <DailyChallenges />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classroom"
            element={
              <ProtectedRoute>
                <Classroom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Subjectlist"
            element={
              <ProtectedRoute>
                <SubjectList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/topics/:subject"
            element={
              <ProtectedRoute>
                <TopicList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/get-hints"
            element={
              <ProtectedRoute>
                <GetHints />
              </ProtectedRoute>
            }
          />




          <Route path="/under-construction" element={<UnderConstruction />} />
        </Routes>
      </div>
    </main>
  );
}