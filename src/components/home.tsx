import React from "react";
import WelcomeHero from "./welcome/WelcomeHero";
import FloatingElements from "./welcome/FloatingElements";
import GradientBackground from "./welcome/GradientBackground";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import FeaturesList from "./welcome/FeaturesList";

export default function Home() {
  return (
    <React.Fragment>
      <div className="relative w-full overflow-hidden bg-white">
        <GradientBackground />
        <FloatingElements />
        <Navbar />
        <div className="relative z-10 flex min-h-screen items-center justify-center pt-16 pb-24">
          <WelcomeHero />
        </div>
        <div className="relative z-10 bg-white/80 backdrop-blur-md py-12">
          <FeaturesList />
        </div>
        <Footer />
      </div>
    </React.Fragment>
  );
}
