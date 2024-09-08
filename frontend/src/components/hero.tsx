import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const Hero = ({ scrollProjectedDataSection }) => {
  const ref = useRef<HTMLParagraphElement>(null);

  const isInView = useInView(ref);

  return (
    <div className="flex flex-col lg:flex-row justify-center py-10 lg:py-10 gap-10 lg:h-screen">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 mt-10 lg:mt-20 2xl:mt-[100px] px-5 md:px-0">
        <h1 className="mb-4 font-bold md:text-left text-6xl lg:text-6xl xl:text-7xl 2xl:text-7xl 3xl:text-9xl">
          Empower Your <br />
          <span className="text-[#6d94ff]">Financial Journey</span>
        </h1>
        <div className="3xl:text-4xl xl:text-3xl 2xl:text-2xl lg:text-2xl text-xl text-white flex-wrap mt-6 md:mt-8 lg:text-left">
          A proven program that empowers you to become a master saver and save
          $10K+ year-after-year.
        </div>
        <motion.button
          whileHover={{ background: "#b3f5a0" }}
          className="px-6 py-3 text-base lg:text-lg 3xl:text-2xl text-black rounded-3xl mb-10 mt-5 lg:mt-4 mx-auto lg:mx-0"
          style={{ background: "#6d94ff" }}
          onClick={scrollProjectedDataSection}
        >
          Get Started
        </motion.button>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 h-screen lg:h-auto relative px-5 md:px-0">
        <div className="absolute top-[-50px] left-[10px] w-[120px] md:w-[200px] h-auto">
          <div className="absolute inset-0 bg-[#e9a0b0] rounded-2xl transform translate-x-2 translate-y-2"></div>
          <div className="absolute inset-0 bg-[#e9a0b0] rounded-2xl transform translate-x-4 translate-y-4"></div>
          <img
            src="./landing.png"
            className="relative rounded-2xl shadow-lg z-[30] w-full h-auto"
          />
          <div className="absolute bottom-10 left-0 z-[100]">
            <motion.img
              src="./hero1.svg"
              className="w-8 md:w-10"
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

        <div className="absolute bottom-[130px] left-[30px] w-32 md:w-[200px]  h-auto">
          <div className="absolute inset-0 bg-[#75bcda] rounded-2xl transform translate-x-2 translate-y-2"></div>
          <div className="absolute inset-0 bg-[#75bcda] rounded-2xl transform translate-x-4 translate-y-4"></div>
          <img
            src="./landing1.png"
            className="relative rounded-2xl shadow-lg z-[30] w-full h-auto"
          />
          {/* <div className="absolute bottom-[-100px] right-[-100px] z-[100] md:w-[200px]">
            <motion.img src="./hero5.svg" className="w-8 md:w-10" />
          </div> */}
        </div>

        <div className="absolute top-[80px] right-[0px] w-32 md:w-[200px] h-auto">
          <div className="absolute inset-0 bg-[#75bcda] rounded-2xl transform translate-x-2 translate-y-2"></div>
          <div className="absolute inset-0 bg-[#f08517] rounded-2xl transform translate-x-4 translate-y-4"></div>
          <img
            src="./landing2.png"
            className="relative rounded-2xl shadow-lg w-full h-auto"
          />
          <div className="absolute top-[-10px] left-[-20px] z-[100]">
            <motion.img
              src="./hero2.svg"
              className="w-16 md:w-20"
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
          <div className="absolute bottom-[-20px] right-[-10px] z-[100]">
            <motion.img
              src="./hero3.svg"
              className="w-10 md:w-12"
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

        <div className="absolute bottom-[50px] right-[0px] w-32 md:w-[200px] h-auto">
          <div className="absolute left-[-50px] bottom-[0px] z-[100] ">
            <motion.img src="./hero5.svg" className="w-[50px] md:w-[100px]" />
          </div>
          <img
            src="./Graph.png"
            className="relative rounded-2xl shadow-lg w-full h-auto"
          />
          <div className="absolute top-[-20px] left-[40px] z-[100]">
            <motion.img
              src="./hero4.svg"
              className="w-8 md:w-10"
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
