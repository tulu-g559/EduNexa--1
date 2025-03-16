import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";

// 3D Shape Component (Inside Canvas)
const FloatingShape = ({ mousePos }) => {
  const shapeRef = useRef();

  // Animate Shape Based on Mouse
  useFrame(() => {
    if (shapeRef.current) {
      shapeRef.current.rotation.y = mousePos.x * Math.PI * 0.5;
      shapeRef.current.rotation.x = mousePos.y * Math.PI * 0.5;
    }
  });

  return (
    <mesh ref={shapeRef} position={[0, 1, 0]}>
      <torusKnotGeometry args={[1.5, 0.4, 100, 16]} />
      <meshStandardMaterial color="red" wireframe />
    </mesh>
  );
};

export default function NotFound() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Update Mouse Position
  const handleMouseMove = (event) => {
    setMousePos({
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    });
  };

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden"
      onMouseMove={handleMouseMove} 
    >
      {/* Text & Button - Always Visible */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="z-10 text-center"
      >
        <h1 className="text-6xl font-bold text-red-600 drop-shadow-lg animate-pulse">
          404
        </h1>
        <p className="text-xl mt-2 text-gray-300">Oops! Page Not Found</p>
      </motion.div>

      {/* Full-Screen 3D Canvas */}
      <Canvas className="absolute inset-0 !w-full !h-full">
        {/* Full-Screen Stars */}
        <Stars radius={100} depth={50} count={5000} factor={4} fade speed={2} />
        <OrbitControls enableZoom={false} enablePan={false} />

        {/* Floating Shape - Pass Mouse Position */}
        <FloatingShape mousePos={mousePos} />

        {/* Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
      </Canvas>

      {/* Go Home Button (Fixed Centered) */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute bottom-10"
      >
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-6 py-3 bg-red-600 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-red-700 transition"
          >
            Go Back Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
