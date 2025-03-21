import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux/authSlice.js';
import { toast } from 'react-hot-toast';
import { auth, db } from '../../firebase/firebase.js';
import { doc, setDoc } from "firebase/firestore";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (location.pathname === "/signup") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !username)) {
      toast.error("Please fill in all fields.");
      return;
    }

    let toastId;
    try {
      dispatch(loginStart());

      if (isLogin) {
        // Handle login
        toastId = toast.loading("Signing in...");
        await signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            dispatch(loginSuccess(user));
            toast.remove(toastId);
            toast.success("Login successful!");
            setEmail("");
            setPassword("");
            navigate("/");
          })
          .catch((error) => {
            dispatch(loginFailure(error.message));
            toast.remove(toastId);
            toast.error(error.message);
            console.log(error.message)
          });
      } else {
        // Handle sign up
        toastId = toast.loading("Signing up...");
        await createUserWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            const user = userCredential.user;


            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
              email: user.email,
              username: username,
              point: 10,
              limit: 10,
            });

            dispatch(loginSuccess(user));
            toast.remove(toastId);
            toast.success("Account created successfully!");
            setEmail(""); 
            setPassword(""); 
            setUsername(""); 
            navigate("/login"); 
          })
          .catch((error) => {
            dispatch(loginFailure(error.message));
            toast.remove(toastId); 
            toast.error(error.message); 
            console.log(error.message)

          });
      }
    } catch (error) {
      dispatch(loginFailure("An error occurred."));
      toast.remove(toastId); 
      toast.error("An error occurred."); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded" type="submit">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

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
