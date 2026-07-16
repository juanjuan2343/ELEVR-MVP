import React from "react";
import { motion } from "motion/react";

interface LandingProps {
  onStartOnboarding: () => void;
  hasPlan: boolean;
  onGoToDashboard: () => void;
}

export default function Landing({ onStartOnboarding, hasPlan, onGoToDashboard }: LandingProps) {
  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center bg-darkbg text-white overflow-hidden px-4">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-neon/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[200px] h-[200px] bg-white/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-md w-full text-center z-10 flex flex-col items-center space-y-10">
        
        {/* ELEVR Monogram Logo Symbol (from ELEVR - LOGOS.pdf) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative group"
        >
          {/* Subtle glowing halo */}
          <div className="absolute inset-0 bg-neon/15 rounded-full blur-xl opacity-60 group-hover:opacity-85 transition-opacity duration-500" />
          
          <svg 
            viewBox="0 0 100 100" 
            className="w-28 h-28 text-neon relative filter drop-shadow-[0_0_15px_rgba(0,245,160,0.3)]" 
            fill="currentColor"
            fillRule="evenodd"
          >
            {/* Bottom bar of E */}
            <polygon points="15,75 34,75 40,65 21,65" />
            {/* Middle bar of E */}
            <polygon points="25,55 44,55 50,45 31,45" />
            {/* R Loop and Top Bar of E */}
            <path d="M 35,35 L 41,25 L 66,25 C 77,25 86,34 86,45 C 86,56 77,65 66,65 L 49,65 L 55,55 L 66,55 C 71,55 76,51 76,45 C 76,39 71,35 66,35 L 35,35 Z" />
            {/* R Leg */}
            <polygon points="55,65 67,65 81,85 69,85" />
          </svg>
        </motion.div>

        {/* Brand Name "E L E V R" Custom Typography */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex justify-center"
        >
          <svg viewBox="0 0 220 30" className="w-64 sm:w-72 text-white fill-current">
            {/* E */}
            <path d="M 0,6 L 4,0 L 28,0 L 24,6 Z M 0,18 L 4,12 L 20,12 L 16,18 Z M 0,30 L 4,24 L 28,24 L 24,30 Z" />
            {/* L */}
            <path d="M 48,0 L 54,0 L 54,24 L 74,24 L 74,30 L 48,30 Z" />
            {/* E */}
            <path d="M 94,6 L 98,0 L 122,0 L 118,6 Z M 94,18 L 98,12 L 114,12 L 110,18 Z M 94,30 L 98,24 L 122,24 L 118,30 Z" />
            {/* V */}
            <path d="M 142,0 L 148,0 L 157,22.5 L 166,0 L 172,0 L 160,30 L 154,30 Z" />
            {/* R */}
            <path d="M 192,6 L 196,0 L 206,0 C 213,0 218,3 218,8 C 218,13 213,16 205,16 L 197,16 L 200,11 L 205,11 C 207,11 211,10 211,8 C 211,6 207,5 205,5 L 196,5 L 192,6 Z M 197,16 L 205,16 L 214,30 L 206,30 Z" />
          </svg>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-[10px] tracking-[0.55em] text-white font-black uppercase text-center pl-[0.55em]"
        >
          RISE <span className="text-neon">•</span> COMMIT <span className="text-neon">•</span> CONQUER
        </motion.div>

        {/* Main Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="w-full space-y-4 pt-4"
        >
          {hasPlan ? (
            <button
              onClick={onGoToDashboard}
              className="w-full py-4 bg-neon hover:bg-neon-dark text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-neon/20 cursor-pointer"
            >
              COMENZAR
            </button>
          ) : (
            <button
              onClick={onStartOnboarding}
              className="w-full py-4 bg-neon hover:bg-neon-dark text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-neon/20 cursor-pointer"
            >
              COMENZAR
            </button>
          )}

          {/* Secondary Actions */}
          {hasPlan && (
            <div className="flex justify-center gap-6 pt-2 text-[9px] font-black uppercase tracking-wider text-white/40">
              <button
                onClick={onStartOnboarding}
                className="hover:text-rose-400 transition flex items-center gap-1 bg-transparent border-0 cursor-pointer"
              >
                Nuevo Plan
              </button>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
