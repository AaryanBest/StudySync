import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import AnimatedLogo from "./AnimatedLogo";
import { Users, Sparkles, Clock, ArrowRight } from "lucide-react";
import { AuthModal } from "../auth/AuthModal";
import { useAuth } from "@/lib/auth";

const WelcomeHero = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const features = [
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Study with peers in real-time",
      href: "/study-rooms",
    },
    {
      icon: Sparkles,
      title: "Smart Progress",
      description: "AI-powered study recommendations",
      href: "/study-planner",
    },
    {
      icon: Clock,
      title: "Time Management",
      description: "Track and optimize study sessions",
      href: "/dashboard",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        className="relative grid lg:grid-cols-2 gap-12 items-center py-12 lg:py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left Column - Content */}
        <motion.div
          className="text-left space-y-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.1]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Study Smarter,
            </span>
            <br />
            <span className="text-gray-900">Achieve Together</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
            Join thousands of students who are transforming their learning
            experience through collaborative study sessions and AI-powered
            insights.
          </p>

          <div className="flex flex-wrap gap-4">
            {!user && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-full"
                  onClick={() => setShowAuthModal(true)}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </div>

          <div className="pt-4">
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <img
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white"
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                    alt={`User ${i + 1}`}
                  />
                ))}
              </div>
              <div className="text-sm">
                <span className="font-semibold">1,000+ students</span> joined
                this week
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Features */}
        <motion.div
          className="relative grid gap-6 lg:gap-8 py-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl transform rotate-3 scale-105" />
          <div className="relative bg-white rounded-2xl shadow-xl p-8 space-y-8 border border-gray-100">
            {features.map((feature, index) => (
              <motion.a
                href={feature.href}
                key={index}
                className="flex items-start hover:bg-gray-50 p-4 rounded-lg transition-colors cursor-pointer gap-x-0 gap-[100]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default WelcomeHero;
