import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Home from "./parallax";
// import { Availability, Colors, Music, SchedulingLinks, Todo } from "./card";

export const features = [
  {
    title: "Personalized Financial Planning",
    subtitle: "Custom Plans for Unique Needs",
    id: "colors",
    color: "#6d94ff",
    svg: "./one.svg",
    // visual: OtherVisual,
  },
  {
    title: "Budget Management",
    subtitle: "Practical Tools for Everyday Financial Health",
    id: "availability",
    color: "#b3f5a0",
    svg: "./one.svg",
    // visual: OtherVisual,
  },
  {
    title: "Expense Tracking",
    subtitle: "Real-Time Insight on your Spending",
    id: "todo-list1",
    // card: Todo,
    color: "#BFBAB7",
    svg: "./one.svg",
    // visual: OtherVisual,
  },
  {
    title: "Debt Reduction Strategies",
    subtitle: "Manage and Reduce Your Debt Effectively",
    id: "music",
    color: "#99a3f0",
    svg: "./one.svg",
    // visual: MusicVisual,
  },

  {
    title: "Savings and Investments",
    subtitle: "Build your Financial Future",
    id: "scheduling-links",
    color: "#fee1d1",
    svg: "./one.svg",
    // visual: OtherVisual,
  },
  // {
  //   title: "Eliminate unhealthy spending habits",
  //   subtitle: "Custom Plans for Unique Needs",
  //   id: "price",
  //   color: "#ccf3f7",
  //   svg: "./one.svg",
  //   // visual: OtherVisual,
  // },
  // {
  //   title: "  Receive reminders, alerts and rewards",
  //   subtitle: "Custom Plans for Unique Needs",
  //   id: "price1",
  //   color: "#f7ccf2",
  //   svg: "./one.svg",
  //   // visual: OtherVisual,
  // },
  //   {
  //     title: "At end...",
  //     id: "end",
  //     card: Team,
  //     visual: OtherVisual,
  //   },
];

const ScrollEffectComponent = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, isInView]);

  return (
    <div className="flex">
      {/* Sticky "What We Do" section */}
      <div className="sticky top-2 h-1/4 w-1/2 ">
        <motion.div
          initial={{ opacity: 1, x: 0 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, x: 0 },
            // hidden: { opacity: 0, x: -100 },
          }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <span className="relative">
              <div className="flex flex-row">
                <h1
                  className={`text-7xl ${
                    isInView ? "text-white" : "text-gray-800"
                  }`}
                >
                  What We Do
                </h1>
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
      <div className="w-1/2 h-1/4 space-y-8" ref={ref}>
        <Home />
      </div>
    </div>
  );
};

export default ScrollEffectComponent;
