import React from "react";
import { motion } from "framer-motion";

interface GradientBackgroundProps {
  primaryColor?: string;
  secondaryColor?: string;
  animationDuration?: number;
}

const GradientBackground = ({
  primaryColor = "rgba(147, 51, 234, 0.1)",
  secondaryColor = "rgba(219, 39, 119, 0.1)",
  animationDuration = 10,
}: GradientBackgroundProps) => {
  return (
    <motion.div
      className="fixed inset-0 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${primaryColor}, ${secondaryColor})`,
        }}
        animate={{
          background: [
            `radial-gradient(circle at 30% 30%, ${primaryColor}, ${secondaryColor})`,
            `radial-gradient(circle at 70% 70%, ${primaryColor}, ${secondaryColor})`,
            `radial-gradient(circle at 30% 70%, ${primaryColor}, ${secondaryColor})`,
            `radial-gradient(circle at 70% 30%, ${primaryColor}, ${secondaryColor})`,
            `radial-gradient(circle at 50% 50%, ${primaryColor}, ${secondaryColor})`,
          ],
        }}
        transition={{
          duration: animationDuration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      />
    </motion.div>
  );
};

export default GradientBackground;
