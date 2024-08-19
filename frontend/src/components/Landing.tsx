import { stagger, useAnimate } from "framer-motion";
import {
  Availability,
  Colors,
  Music,
  SchedulingLinks,
  Todo,
  price,
} from "./features/card";
import { FeatureTitle } from "./features/title";
import { MusicVisual, OtherVisual } from "./features/visual";
import Hero from "./hero";
import "../index.css";
import { useFeatureStore } from "./features/store";
import { useEffect } from "react";
import { useHidePageOverflow } from "../utils/toggle-page-overflow";
import { useEscapePress } from "../utils/use-escape-press";
import ProjectedData from "./ProjectedData";
import Footer from "./Footer";
import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import ScrollEffectComponent from "./features/scrollEffect";
import { AboutUsSection } from "./AboutUsComponent";
// const features = [
//   {
//     title: "Unleash the Master Saver within",
//     id: "colors",
//     card: Colors,
//     visual: OtherVisual,
//   },
//   {
//     title: "Manifest your ideal life and purpose",
//     id: "availability",
//     card: Availability,
//     visual: OtherVisual,
//   },
//   {
//     title: "Commit to a savings goal",
//     id: "todo-list1",
//     card: Todo,
//     visual: OtherVisual,
//   },
//   {
//     title: "Implement our proven savings mastery strategies",
//     id: "music",
//     card: Music,
//     visual: MusicVisual,
//   },

//   {
//     title: "Develop a plan",
//     id: "scheduling-links",
//     card: SchedulingLinks,
//     visual: OtherVisual,
//   },
//   {
//     title: "Eliminate unhealthy spending habits",
//     id: "price",
//     card: SchedulingLinks,
//     visual: OtherVisual,
//   },
//   {
//     title: "  Receive reminders, alerts and rewards",
//     id: "price1",
//     card: SchedulingLinks,
//     visual: OtherVisual,
//   },
//   //   {
//   //     title: "At end...",
//   //     id: "end",
//   //     card: Team,
//   //     visual: OtherVisual,
//   //   },
// ];

function Landing() {
  const [scope, animate] = useAnimate();
  const fullscreenFeature = useFeatureStore((state) => state.fullscreenFeature);
  const lastFullscreenFeature = useFeatureStore(
    (state) => state.lastFullscreenFeature
  );
  const ref = useRef(null);
  const { scrollXProgress } = useScroll({ container: ref });

  const setFullscreenFeature = useFeatureStore(
    (state) => state.setFullscreenFeature
  );

  const onEscapePress = () => {
    if (fullscreenFeature) setFullscreenFeature(null);
  };

  useEscapePress(onEscapePress);
  useHidePageOverflow(!!fullscreenFeature);

  // useEffect(() => {
  //   if (fullscreenFeature) {
  //     animate([
  //       [
  //         ".feature-title",
  //         { opacity: 0, x: "-200px" },
  //         { duration: 0.3, delay: stagger(0.05) },
  //       ],
  //       [
  //         `.visual-${lastFullscreenFeature}`,
  //         { opacity: 1, scale: 1, pointerEvents: "auto" },
  //         { at: "<" },
  //       ],
  //       [".active-card .gradient", { opacity: 0, scale: 0 }, { at: "<" }],
  //       [".active-card .show-me-btn", { opacity: 0 }, { at: "<" }],
  //       [
  //         ".back-to-site-btn",
  //         { opacity: 1, y: "0px" },
  //         { at: "<", duration: 0.3 },
  //       ],
  //     ]);
  //   } else {
  //     animate([
  //       [
  //         ".feature-title",
  //         { opacity: 1, x: "0px" },
  //         { duration: 0.3, delay: stagger(0.05) },
  //       ],
  //       [
  //         `.visual-${lastFullscreenFeature}`,
  //         { opacity: 0, scale: 0.75, pointerEvents: "none" },
  //         { at: "<" },
  //       ],
  //       [".active-card .gradient", { opacity: 1, scale: 1 }, { at: "<" }],
  //       [
  //         ".back-to-site-btn",
  //         { opacity: 0, y: "300px" },
  //         { at: "<", duration: 0.3 },
  //       ],
  //       [".active-card .show-me-btn", { opacity: 1 }],
  //     ]);
  //   }
  // }, [animate, fullscreenFeature, lastFullscreenFeature]);

  return (
    <>
      <div className="mx-auto max-w-7xl p-8 text-white">
        <Hero />
        <ScrollEffectComponent />
        {/* <div ref={scope}>
          <div className="flex w-full items-start gap-20">
            <div className="w-full py-[50vh]">
              <ul ref={ref}>
                {features.map((feature) => (
                  <li key={feature.id}>
                    <FeatureTitle id={feature.id}>{feature.title}</FeatureTitle>
                  </li>
                ))}
              </ul>
            </div>
            <div className="sticky top-0 flex h-screen m-10 w-full items-center">
              <div className="relative aspect-square w-full rounded-3xl bg-gray-100 [&:has(>_.active-card)]:bg-transparent">
                {features.map((feature) => (
                  <feature.card id={feature.id} key={feature.id} />
                ))}
              </div>
            </div>
          </div>
        </div> */}
        {/* <FeatureTitle id={"end"}>{"At end..."}</FeatureTitle> */}
        {/* <ProjectedData /> */}
      </div>
      <AboutUsSection />
      <ProjectedData />
      <Footer />
    </>
  );
}

export default Landing;
