import { Routes, Route } from "react-router-dom";
import Hero from "./components/home_page/hero";
import Navbar from "./components/home_page/navbar";
import { SparklesCore } from "./components/home_page/sparkles";
import Game from "./game.jsx";

export default function App() {
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
          <Navbar />
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </div>
      </main>
    </>
  );
}
