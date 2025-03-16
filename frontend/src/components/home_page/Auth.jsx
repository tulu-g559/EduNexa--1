import React, { useState, useEffect } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const AuthPage = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  // Set correct state based on URL
  useEffect(() => {
    if (location.pathname === "/signup") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {/* Form */}
        <form className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          />

          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="text-center my-4 text-gray-400">OR</div>

        {/* Social Login Buttons */}
        <div className="flex justify-center space-x-4">
          <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 p-2 rounded">
            <FaGoogle />
            <span>Google</span>
          </button>
          <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 p-2 rounded">
            <FaGithub />
            <span>GitHub</span>
          </button>
        </div>

        {/* Toggle Between Login & Signup */}
        <p className="text-center text-gray-400 mt-4">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <Link to="/signup" className="text-purple-400 hover:underline">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link to="/login" className="text-purple-400 hover:underline">
                Login
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
