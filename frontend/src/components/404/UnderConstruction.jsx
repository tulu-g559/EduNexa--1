import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";

// 🏗️ 3D Construction Worker Component
function ConstructionWorker() {
    const { scene } = useGLTF("../../../src/components/404/Construction.glb");
    const workerRef = useRef();
  
    // Animate the worker's hammering action
    useFrame(() => {
      if (workerRef.current) {
        workerRef.current.rotation.y += 0.01;
        workerRef.current.children[1].rotation.x = Math.sin(Date.now() * 0.005) * 0.3;
      }
    });
  
    return (
      <primitive 
        object={scene} 
        ref={workerRef} 
        position={[0, 1, 0]}
        scale={3} 
      />
    );
  }
  
  export default function UnderConstruction() {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="z-10 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-yellow-500 drop-shadow-lg animate-pulse">
            🚧 Under Construction 🚧
          </h1>
          <p className="text-lg md:text-xl mt-2 text-gray-300">
            This page is currently being built. Check back soon!
          </p>
        </motion.div>
  
        {/* 3D Canvas */}
        <Canvas className="absolute inset-0 !w-full !h-full">
          <ambientLight intensity={1} />
          <directionalLight position={[3, 3, 3]} />
          <OrbitControls enableZoom={false} enablePan={false} />
  
          {/* Call the 3D Construction Worker Component */}
          <ConstructionWorker />
        </Canvas>
  
        {/* Go Home Button */}
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
              className="px-6 py-3 bg-yellow-600 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-yellow-700 transition"
            >
              Go Back Home
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }
  