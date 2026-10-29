'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ModalWrapperProps {
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
  className?: string;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  children,
  onClose,
  maxWidth = 'max-w-2xl',
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.18, ease: 'easeOut' } }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15, ease: 'easeIn' } }}
        transition={{
          type: 'spring',
          stiffness: 420,
          damping: 28,
        }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxWidth} bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/90 ${className}`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
