// import styles from "./page.module.scss";
// import { projects } from "../data";
import { features } from "./scrollEffect";
// import Card from "../components/Card";
import { useScroll } from "framer-motion";
import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import Card from "./card";
// import Card from "./card";

export default function Home() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  });

  return (
    <div ref={container} className="sticky top-2">
      {features.map((project, i) => {
        const targetScale = 1 - (features.length - i) * 0.05;
        console.log(targetScale);
        return (
          <div>
            <Card
              key={`p_${i}`}
              i={i}
              project={project}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          </div>
        );
      })}
    </div>
  );
}
