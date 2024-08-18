// import Image from "next/image";
import { useTransform, motion, useScroll } from "framer-motion";
import { useRef } from "react";

const Card = ({
  i,
  // title,
  // description,
  // src,
  // url,
  // color,
  project,
  // progress,
  // range,
  // targetScale,
}) => {
  // const container = useRef(null);
  // const { scrollYProgress } = useScroll({
  //   target: container,
  //   offset: ["start end", "start start"],
  // });

  // const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  // const scale = useTransform(progress, range, [1, targetScale]);
  // console.log(scale);
  return (
    <div
      // ref={container}
      className="h-[250px] flex items-center justify-center text-black"
    >
      <motion.div
        style={{
          backgroundColor: project.color,
          // scale,
          // top: `calc(-5vh + ${i * 25}px)`,
        }}
        // viewport={{ root: container }}
        className="flex flex-col h-[200px] w-[1000px]  rounded-[25px] justify-center text-center origin-top"
      >
        <h2 className=" m-0 text-3xl">{project.title}</h2>
        <h2 className="">{project.subtitle}</h2>
      </motion.div>
    </div>
  );
};

export default Card;
