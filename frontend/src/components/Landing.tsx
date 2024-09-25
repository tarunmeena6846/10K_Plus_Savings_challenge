import Hero from "./hero";
import ProjectedData from "./ProjectedData";
import Footer from "./Footer";
import ScrollEffectComponent from "./features/scrollEffect";
import { AboutUsSection } from "./AboutUsComponent";
import { useRef } from "react";

function Landing() {
  const projectedDataRef = useRef(null); // Create a reference

  const scrollToProjectedSection = () => {
    if (projectedDataRef.current) {
      projectedDataRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      <div className="mx-auto  text-white px-8">
        <Hero scrollProjectedDataSection={scrollToProjectedSection} />
        <ScrollEffectComponent />
      </div>
      <AboutUsSection />
      <div ref={projectedDataRef}>
        <ProjectedData />
      </div>
      {/* <div className="w-full"> */}
      <Footer />
      {/* </div> */}
    </>
  );
}

export default Landing;
