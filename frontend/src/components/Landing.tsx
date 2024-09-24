// import { stagger, useAnimate } from "framer-motion";
// import { FeatureTitle } from "./features/title";
// import { MusicVisual, OtherVisual } from "./features/visual";
import Hero from "./hero";
// import "../index.css";
// import { useFeatureStore } from "./features/store";
// import { useEffect } from "react";
// import { useHidePageOverflow } from "../utils/toggle-page-overflow";
// import { useEscapePress } from "../utils/use-escape-press";
import ProjectedData from "./ProjectedData";
import Footer from "./Footer";
// import { useRef } from "react";

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
