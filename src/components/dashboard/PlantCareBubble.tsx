// src/components/PetalBotBubble.tsx
import { motion } from 'framer-motion';
import React from 'react';

interface PlantCareBubbleProp {
  message: string;
}

const PlantCareBubble: React.FC<PlantCareBubbleProp> = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, x: 30 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 12 }}
      className="fixed bottom-32 right-10 z-50 flex items-end gap-4"
    >


      <div className="relative bg-green-100 border border-green-400 text-green-900 text-base rounded-2xl p-4 shadow-xl max-w-sm
                      before:content-[''] before:absolute before:bottom-3 before:right-[-10px]
                      before:border-8 before:border-transparent before:border-l-green-400 before:border-r-0 before:border-t-0
                      after:content-[''] after:absolute after:bottom-3 after:right-[-8px]
                      after:border-8 after:border-transparent after:border-l-green-100 after:border-r-0 after:border-t-0">
        {message}
      </div>
            <motion.img
        src="/icon.svg"
        alt="PetalBot"
        className="w-24 h-24"
        animate={{ y: [0, -6, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default PlantCareBubble;
