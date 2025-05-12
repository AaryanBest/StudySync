import React from "react";
import { motion } from "framer-motion";

interface AnimatedLogoProps {
  width?: number;
  height?: number;
  onAnimationComplete?: () => void;
}

const AnimatedLogo = ({
  width = 200,
  height = 200,
  onAnimationComplete = () => {},
}: AnimatedLogoProps) => {
  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      }}
      onAnimationComplete={onAnimationComplete}
    >
      <div
        style={{ width, height: height * 0.4 }}
        className="relative flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center space-x-2"
        >
          <div className="relative">
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative bg-white rounded-lg p-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
              >
                <path
                  d="M12 4.5v15m7.5-7.5h-15"
                  stroke="url(#paint0_linear)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="4.5"
                    y1="12"
                    x2="19.5"
                    y2="12"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#9333EA" />
                    <stop offset="1" stopColor="#DB2777" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight"
          >
            StudySync
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnimatedLogo;
