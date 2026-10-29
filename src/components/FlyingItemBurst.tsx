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
        {particles.map((p) => {
          // Calculate an arc control point for realistic 2D ballistic projectile trajectory
          const midX = (p.x + p.targetX) / 2;
          const arcPeakY = Math.min(p.y, p.targetY) - 80;

          return (
            <motion.div
              key={p.id}
              initial={{
                x: p.x,
                y: p.y,
                scale: 0.7,
                opacity: 0.9,
              }}
              animate={{
                x: [p.x, midX, p.targetX],
                y: [p.y, arcPeakY, p.targetY],
                scale: [0.7, 1.25, 0.35],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 0.58,
                times: [0, 0.45, 1],
                ease: [0.22, 1, 0.36, 1],
              }}
              onAnimationComplete={() => onComplete(p.id)}
              className="absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-linear-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 font-black text-xs shadow-2xl border-2 border-white ring-4 ring-amber-400/30 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span className="truncate max-w-[140px] tracking-tight drop-shadow-xs font-mono">{p.label}</span>
              <span className="text-[10px] font-black bg-slate-950 text-amber-300 px-1.5 py-0.2 rounded-full">+1</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
