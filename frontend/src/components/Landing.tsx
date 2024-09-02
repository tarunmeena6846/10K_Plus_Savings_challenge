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
      <div className="mx-auto max-w-7xl p-8 text-white">
        <Hero scrollProjectedDataSection={scrollToProjectedSection} />
        <ScrollEffectComponent />
      </div>
      <AboutUsSection />
      <div ref={projectedDataRef}>
        <ProjectedData />
      </div>
      <Footer />
    </>
  );
}

export default Landing;

// function Landing() {
//   const [progress, setProgress] = useState(0);
//   console.log("here");
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress((prevProgress) =>
//         prevProgress < 100 ? prevProgress + 10 : 100
//       );
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);
//   console.log(progress);
//   return (
//     <div className=" flex flex-col justify-center items-center mt-[40px] p-[10px]">
//       <h1 className="text-pink-200">Example progress bar</h1>
//       <ProgressBar progress={progress} />
//     </div>
//   );
// }

// export default Landing;
