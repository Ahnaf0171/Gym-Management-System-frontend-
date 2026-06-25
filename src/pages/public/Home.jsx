import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import { WhyJoinSection } from "@/components/sections/WhyJoinSection";
import PlansSection from "@/components/sections/PlansSection";
import { CoachesSection } from "@/components/sections/CoachesSection";
import { VisitSection } from "@/components/sections/VisitSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <WhyJoinSection />
      <PlansSection />
      <CoachesSection />
      <VisitSection />
    </div>
  );
}
