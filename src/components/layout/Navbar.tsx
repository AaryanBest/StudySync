import { useState } from "react";
import { Button } from "@/components/ui/button";
import AnimatedLogo from "../welcome/AnimatedLogo";
import { AuthModal } from "../auth/AuthModal";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <AnimatedLogo width={120} height={40} />
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Dashboard
              </a>
              <a
                href="/study-rooms"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Study Modes
              </a>
              <a
                href="/study-planner"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Study Planner
              </a>
              <a
                href="/focus-challenge"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Focus Challenge
              </a>
              <a
                href="/community"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Community
              </a>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    className="font-medium"
                    onClick={() => signOut()}
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="font-medium"
                    onClick={() => setShowAuthModal(true)}
                  >
                    Sign in
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
                    onClick={() => setShowAuthModal(true)}
                  >
                    Sign up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
