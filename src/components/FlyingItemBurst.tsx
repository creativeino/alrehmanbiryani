'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Particle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  label: string;
}

interface FlyingItemBurstProps {
  particles: Particle[];
  onComplete: (id: number) => void;
}

export const FlyingItemBurst: React.FC<FlyingItemBurstProps> = ({ particles, onComplete }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              x: p.x,
              y: p.y,
              scale: 0.5,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              x: p.targetX,
              y: p.targetY,
              scale: [0.5, 1.25, 0.3],
              opacity: [1, 1, 0],
              rotate: [0, -15, 20],
            }}
            transition={{
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1], // Smooth cubic out
            }}
            onAnimationComplete={() => onComplete(p.id)}
            className="absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-xs shadow-2xl border-2 border-white/90 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span className="truncate max-w-[120px]">{p.label}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
