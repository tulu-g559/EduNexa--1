"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Button from "./button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase.js";  

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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
      className="relative z-50 flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10 bg-black"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <img
          src="../../../images/logo.png"
          alt="EduNexa Logo"
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 transition-all"
        />
        <span className="text-white font-medium text-lg sm:text-xl">Edu</span><span className="text-purple-500 font-medium text-lg sm:text-xl">Nexa</span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center space-x-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/Subjectlist">Let's Study</NavLink>
        <NavLink to="/classroom">Classroom</NavLink>
        <NavLink to="/chatbot">AI-Tutor</NavLink>
        <NavLink to="/game">Earn Rewards</NavLink>
        <NavLink to="/get-hints">Solver</NavLink>
      </div>

      {/* Desktop Auth Buttons */}
      <div className="hidden lg:flex items-center space-x-4">
        {user ? (
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <Link to="/login">
            <Button>Get Started</Button>
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <X className="w-8 h-8 text-purple-500" /> // Purple Close Icon
        ) : (
          <Menu className="w-8 h-8 text-purple-500" /> // Purple Hamburger Icon
        )}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-16 left-0 w-full bg-black text-white flex flex-col space-y-4 p-6 border-t border-white/10 lg:hidden"
        >
          <NavLink to="/" onClick={() => setIsOpen(false)}>Home</NavLink>
          <NavLink to="/about" onClick={() => setIsOpen(false)}>About</NavLink>
          <NavLink to="/Subjectlist" onClick={() => setIsOpen(false)}>Let's Study</NavLink>
          <NavLink to="/classroom" onClick={() => setIsOpen(false)}>Classroom</NavLink>
          <NavLink to="/chatbot" onClick={() => setIsOpen(false)}>AI-Tutor</NavLink>
          <NavLink to="/game" onClick={() => setIsOpen(false)}>Earn Rewards</NavLink>
          <NavLink to="/get-hints" onClick={() => setIsOpen(false)}>Solver</NavLink>

          {/* Mobile Auth Buttons */}
          {user ? (
            <Button onClick={handleLogout} className="w-full">Logout</Button>
          ) : (
            <Link to="/login" className="w-full">
              <Button className="w-full">Get Started</Button>
            </Link>
          )}

        </motion.div>
      )}
    </motion.nav>
  );
}

function NavLink({ to, children, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="text-gray-300 hover:text-white transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full" />
    </Link>
  );
}