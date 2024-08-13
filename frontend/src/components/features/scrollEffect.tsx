import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

const ScrollEffectComponent = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, isInView]);

  return (
    <div className="flex  h-screen p-8">
      {/* Sticky "What We Do" section */}
      <div className="sticky top-0 h-1/4 w-1/2 ">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, x: 0 },
            hidden: { opacity: 0, x: -100 },
          }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <span className="relative">
              <div className="flex flex-row">
                <h1 className="text-7xl">What We Do</h1>
                <motion.img
                  src="./arrow.svg"
                  className="w-20 ml-4"
                  animate={{
                    x: [0, 20, 0], // Moves 20px to the right and then back
                  }}
                  transition={{
                    duration: 2, // Duration of one complete cycle (to-and-fro)
                    repeat: Infinity, // Infinite repeat
                    ease: "easeInOut", // Easing function for smooth motion
                  }}
                />
              </div>
              <img
                src="./line.svg"
                className="absolute left-1/2 top-full transform -translate-x-20 mt-2"
              />
            </span>
          </div>
        </motion.div>
      </div>

      {/* Scrollable sub-divs */}
      <div className=" w-1/2 h-full flex flex-col space-y-8" ref={ref}>
        {["Sub Div 1", "Sub Div 2", "Sub Div 3", "Sub Div 4", "Sub Div 5"].map(
          (item, index) => (
            <motion.div
              key={index}
              className="bg-gray-200 p-4 rounded-lg shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h2 className="text-xl font-semibold">{item}</h2>
              <p>This is content for {item}.</p>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
};

export default ScrollEffectComponent;
