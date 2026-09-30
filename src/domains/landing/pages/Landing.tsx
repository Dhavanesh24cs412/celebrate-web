import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { HeroSection } from "../components/sections/HeroSection";
import { About } from "../components/sections/About";
import { HowItWorks } from "../components/sections/HowItWorks";
import { ForClients } from "../components/sections/ForClients";
import { ForPlanners } from "../components/sections/ForPlanners";
import { EventTypes } from "../components/sections/EventTypes";
import { CTA } from "../components/sections/CTA";

export const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <About />
        <HowItWorks />
        <ForClients />
        <ForPlanners />
        <EventTypes />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};
