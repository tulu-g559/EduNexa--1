import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center py-16"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-pink-500">
          About <span className="text-purple-400">EduNexa</span>
        </h1>
        <p className="text-lg md:text-xl mt-4 text-gray-300 max-w-3xl mx-auto">
          Transforming education with AI-driven precision. Our mission is to
          provide students and educators with innovative tools for an
          intelligent learning experience.
        </p>
      </motion.section>

      {/* Our Mission & Vision */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            <h2 className="text-2xl font-bold text-pink-400">Our Mission</h2>
            <p className="text-gray-300 mt-2">
              To revolutionize digital learning with AI-powered tools that
              simplify, enhance, and personalize education for every student.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            <h2 className="text-2xl font-bold text-pink-400">Our Vision</h2>
            <p className="text-gray-300 mt-2">
              To become the leading AI-powered education platform, bridging the
              gap between technology and learning for a smarter future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-16 bg-gray-800">
        <h2 className="text-center text-3xl font-bold text-pink-500 mb-8">
          Meet Our Team
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {/* Team Member 1 */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 p-6 rounded-lg shadow-lg text-center w-64 hover:shadow-pink-500/50 transition-all"
          >
            <img
              src="../../../images/ayon.jpg"
              alt="Team Member"
              className="rounded-full mx-auto mb-4 border-4 border-pink-500"
            />
            <h3 className="text-lg font-bold">Ayon Paul</h3>
            <p className="text-gray-400">Frontend Developer</p>
          </motion.div>

          {/* Team Member 2 */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 p-6 rounded-lg shadow-lg text-center w-64 hover:shadow-pink-500/50 transition-all"
          >
            <img
              src="../../../images/arnab.jpg"
              alt="Team Member"
              className="rounded-full mx-auto mb-4 border-4 border-purple-500"
            />
            <h3 className="text-lg font-bold">Arnab Ghosh</h3>
            <p className="text-gray-400">Backend developer</p>
          </motion.div>

          {/* Team Member 3 */}
          {/* <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 p-6 rounded-lg shadow-lg text-center w-64 hover:shadow-pink-500/50 transition-all"
          >
            <img
              src="../../../images/archak1.jpg"
              alt="Team Member"
              className="rounded-full mx-auto mb-4 border-4 border-yellow-500"
            />
            <h3 className="text-lg font-bold">Archak Khandayit</h3>
            <p className="text-gray-400">Full-Stack Developer</p>
          </motion.div> */}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <h2 className="text-3xl font-bold text-pink-500">
            Join Us in Shaping the Future of Learning
          </h2>
          <p className="text-gray-300 mt-2">
            Become part of our mission to revolutionize education with AI-driven
            solutions.
          </p>
          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="mt-6 px-6 py-3 bg-pink-600 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-pink-700 transition"
            >
              Contact Us
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
