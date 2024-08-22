// import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const Hero = ({ scrollProjectedDataSection }) => {
  return (
    <div className="flex flex-row justify-center py-20 gap-10">
      <div className="w-1/2 mt-30">
        <h1 className="mb-4 font-heading text-6xl font-bold">
          Empower Your Financial Journey
        </h1>
        <div
          // ref={ref}
          className="
          font-heading text-xl text-white flex-wrap"
          // transition={{ duration: 0.5 }}
          style={{ marginTop: "60px" }} // Add margin to the second line
        >
          A proven program that empowers you to become a master saver and save
          $10K+ year-after-year.
        </div>
        <motion.button
          whileHover={{ background: "#b3f5a0" }}
          className="p-4  text-black rounded-3xl mt-3"
          style={{ background: "#6d94ff" }}
          onClick={scrollProjectedDataSection}
        >
          Get Started
        </motion.button>
      </div>
      <div className="w-1/2 h-screen relative">
        <div className="absolute top-[-50px] left-[10px] w-40 h-30">
          <div className="absolute inset-0 bg-[#e9a0b0] rounded-2xl transform translate-x-2 translate-y-2"></div>
          <div className="absolute inset-0 bg-[#e9a0b0] rounded-2xl transform translate-x-4 translate-y-4"></div>

          <img
            src="./landing.png"
            className="relative rounded-2xl shadow-lg z-[30]"
          />
          <div className="absolute bottom-10 left-0 z-[100]">
            <motion.img
              src="./hero1.svg"
              className="w-10"
              animate={{
                y: [0, 20, 0], // Moves 20px to the right and then back
              }}
              transition={{
                duration: 3, // Duration of one complete cycle (to-and-fro)
                repeat: Infinity, // Infinite repeat
                ease: "easeInOut", // Easing function for smooth motion
              }}
            />
          </div>
        </div>
        <div className="absolute bottom-[130px] left-[50px] w-40 ">
          <div className="absolute inset-0 bg-[#75bcda] rounded-2xl transform translate-x-2 translate-y-2"></div>
          <div className="absolute inset-0 bg-[#75bcda] rounded-2xl transform translate-x-4 translate-y-4"></div>
          <img
            src="./landing1.png"
            className="relative rounded-2xl shadow-lg z-[30]"
          />
          <div className="absolute bottom-[-150px] right-[-150px] z-[100]">
            <motion.img
              src="./hero5.svg"
              // className="w-10"
              // animate={{
              //   y: [0, 20, 0], // Moves 20px to the right and then back
              // }}
              // transition={{
              //   duration: 3, // Duration of one complete cycle (to-and-fro)
              //   repeat: Infinity, // Infinite repeat
              //   ease: "easeInOut", // Easing function for smooth motion
              // }}
            />
          </div>
        </div>

        <div className="absolute top-[30px] right-[50px] w-40">
          <div className="absolute inset-0 bg-[#f08517] rounded-2xl transform translate-x-2 translate-y-2"></div>
          <div className="absolute inset-0 bg-[#f08517] rounded-2xl transform translate-x-4 translate-y-4"></div>
          <img
            src="./landing2.png"
            className="relative rounded-2xl shadow-lg"
          />
          <div className="absolute top-[-10px] left-[-30px] z-[100]">
            <motion.img
              src="./hero2.svg"
              className="w-20"
              animate={{
                rotate: 360, // Rotate the image to complete the circle
              }}
              transition={{
                duration: 8, // Duration of one full circle
                ease: "linear", // Smooth motion
                repeat: Infinity, // Infinite loop
              }}
            />
          </div>
          <div className="absolute bottom-[-30px] right-[-20px] z-[100]">
            <motion.img
              src="./hero3.svg"
              className="w-[50px]"
              animate={{
                y: [0, 20, 0], // Moves 20px to the right and then back
              }}
              transition={{
                duration: 3, // Duration of one complete cycle (to-and-fro)
                repeat: Infinity, // Infinite repeat
                ease: "easeInOut", // Easing function for smooth motion
              }}
            />
          </div>
        </div>
        <div className="absolute bottom-[70px] right-[50px] w-40">
          <img src="./Graph.png" className="relative rounded-2xl shadow-lg" />
          <div className="absolute top-[-30px] left-[50px] z-[100]">
            <motion.img
              src="./hero4.svg"
              className="w-[50px]"
              animate={{
                y: [0, 20, 0], // Moves 20px to the right and then back
              }}
              transition={{
                duration: 3, // Duration of one complete cycle (to-and-fro)
                repeat: Infinity, // Infinite repeat
                ease: "easeInOut", // Easing function for smooth motion
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
