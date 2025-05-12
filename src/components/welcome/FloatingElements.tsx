import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Trophy, Users, Brain, Target, Clock } from "lucide-react";

interface FloatingElementsProps {
  numberOfElements?: number;
}

const FloatingElements = ({ numberOfElements = 6 }: FloatingElementsProps) => {
  const icons = [
    { Icon: BookOpen, color: "text-indigo-600/40" },
    { Icon: Trophy, color: "text-amber-600/40" },
    { Icon: Users, color: "text-emerald-600/40" },
    { Icon: Brain, color: "text-violet-600/40" },
    { Icon: Target, color: "text-rose-600/40" },
    { Icon: Clock, color: "text-blue-600/40" },
  ].slice(0, numberOfElements);

  return (
    <div className="fixed inset-0 pointer-events-none bg-white/50">
      {icons.map((icon, index) => (
        <motion.div
          key={index}
          className={`absolute ${icon.color}`}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: [null, Math.random() * window.innerWidth],
            y: [null, Math.random() * window.innerHeight],
            opacity: [0, 0.7, 0.5],
            scale: [0, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        >
          <icon.Icon size={32} />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingElements;
