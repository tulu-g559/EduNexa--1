"use client";

import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import Button from "./button"; 
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase.js";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logout successful!");
      onLogout();
      navigate("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="relative z-50 flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10"
    >
      <Link to="/" className="flex items-center space-x-2">
        <img src="../../../images/logo.png" alt="EduNexa Logo" className="w-12 h-12" />
        <span className="text-white font-medium text-xl m-0">Edu</span>
        <span className="text-purple-500 font-medium text-xl">Nexa</span>
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/Subjectlist">Let's Study</NavLink>
        <NavLink to="/classroom">Classroom</NavLink>
        <NavLink to="/chatbot">AI-Tutor</NavLink>
        <NavLink to="/game">Gamification</NavLink>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <Link to="/login">
            <Button>Get Started</Button>
          </Link>
        )}
      </div>

      <Button className="md:hidden">
        <Menu className="w-6 h-6" />
      </Button>
    </motion.nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} className="text-gray-300 hover:text-white transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full" />
    </Link>
  );
}
