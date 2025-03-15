"use client";

import { Bot, Menu } from "lucide-react";
import { motion } from "framer-motion";
import Button from "./button"; 
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="relative z-50 flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10"
    >
      <Link to="/" className="flex items-center space-x-2">
        <img src="../src/components/home_page/logo.png" alt="EduNexa Logo" className="w-12 h-12" />
        <span className="text-white font-medium text-xl m-0">Edu</span>
        <span className="text-purple-500 font-medium text-xl">Nexa</span>
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/how-it-works">About</NavLink>
        <NavLink to="/examples">Let's Study</NavLink>
        <NavLink to="/under-construction">AI-Tutor</NavLink>
        <NavLink to="/game">Gamification</NavLink> 
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <Button>Sign In</Button>
        <Button>Get Started</Button>
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
