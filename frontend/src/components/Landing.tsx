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

function Landing() {
  // const fullscreenFeature = useFeatureStore((state) => state.fullscreenFeature);
  // const lastFullscreenFeature = useFeatureStore(
  //   (state) => state.lastFullscreenFeature
  // );
  // const ref = useRef(null);
  // const { scrollXProgress } = useScroll({ container: ref });

  // const setFullscreenFeature = useFeatureStore(
  //   (state) => state.setFullscreenFeature
  // );

  // const onEscapePress = () => {
  //   if (fullscreenFeature) setFullscreenFeature(null);
  // };

  // useEscapePress(onEscapePress);
  // useHidePageOverflow(!!fullscreenFeature);

  return (
    <>
      <div className="mx-auto max-w-7xl p-8 text-white">
        <Hero />
        <ScrollEffectComponent />
      </div>
      <AboutUsSection />
      <ProjectedData />
      <Footer />
    </>
  );
}

export default Landing;
