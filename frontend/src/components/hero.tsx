import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const Hero = ({ scrollProjectedDataSection }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["center end", "start start"],
  });
  console.log(scrollYProgress);
  // Create diagonal motion by transforming both x and y axes
  const xTransform1 = useTransform(scrollYProgress, [0.7, 0], [30, 0]); // Adjust the range as needed
  const yTransform1 = useTransform(scrollYProgress, [0.7, 0], [30, 0]); // Adjust the range as needed
  const xTransform = useTransform(scrollYProgress, [0.7, 0], [50, 0]); // Adjust the range as needed
  const yTransform = useTransform(scrollYProgress, [0.7, 0], [50, 0]); // Adjust the range as needed

  // const marginRight = useTransform(scrollYProgress, [1, 0], ["100px", "100px"]);

  return (
    <div
      // ref={container}
      className="flex flex-col lg:flex-row justify-center py-10 lg:py-10 gap-10 lg:h-screen"
    >
      {/* Left Section */}
      <div className="w-full lg:w-1/2 mt-10 lg:mt-20 2xl:mt-[100px] md:px-0">
        <h1 className="mb-4 font-bold md:text-left text-6xl lg:text-6xl xl:text-7xl 2xl:text-7xl">
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
      <motion.div className="w-full lg:w-1/2 h-screen sm:h-screen md:h-screen lg:h-screen relative px-5 md:px-0">
        <motion.div
          className="absolute top-[-50px] left-[10px] w-[120px] sm:w-[200px] lg:w-[150px] xl:w-[200px] lg:top-[0px] lg:left-[0px] h-auto"
          // ref={ref}
          // style={{ x: xTransform, y: yTransform }} // Apply diagonal movement
        >
          <motion.div
            className="absolute inset-0 bg-[] transform translate-x-[40px] translate-y-[40px]"
            ref={ref}
            style={{ x: xTransform, y: yTransform }}
          >
            <img
              src="./landing.png"
              className="relative rounded-2xl shadow-lg z-[30] w-full h-auto"
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-[] transform translate-x-[20px] translate-y-[20px]"
            ref={ref}
            style={{ x: xTransform1, y: yTransform1 }}
          >
            <img
              src="./landing.png"
              className="relative rounded-2xl shadow-lg z-[30] w-full h-auto"
            />
          </motion.div>

          <img
            src="./landing.png"
            className="relative rounded-2xl shadow-lg z-[30] w-full h-auto"
          />
          <div className="absolute bottom-10 left-0 z-[40]">
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
        </motion.div>

        <div
          className="absolute bottom-[160px] left-[0px] w-[120px] md:bottom-[60px] sm:right-[40px] sm:bottom-[40px] lg:left-[0px]  sm:w-[200px] lg:w-[150px] xl:w-[200px]  h-auto"
          // ref={ref}
          // style={{ x: xTransform, y: yTransform }} // Apply diagonal movement
        >
          <motion.div
            className="absolute inset-0 bg-[] transform translate-x-[40px] translate-y-[40px]"
            ref={ref}
            style={{ x: xTransform, y: yTransform }}
          >
            <img
              src="./landing1.png"
              className="relative rounded-2xl shadow-lg z-[30] w-full h-auto"
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-[] transform translate-x-[20px] translate-y-[20px]"
            ref={ref}
            style={{ x: xTransform1, y: yTransform1 }}
          >
            <img
              src="./landing1.png"
              className="relative rounded-2xl shadow-lg z-[30] w-full h-auto"
            />
          </motion.div>
          <img
            src="./landing1.png"
            className="relative rounded-3xl shadow-lg z-[30] w-full h-auto"
          />
          {/* <div className="absolute bottom-[-100px] right-[-100px] z-[100] md:w-[200px]">
            <motion.img src="./hero5.svg" className="w-8 md:w-10" />
          </div> */}
        </div>

        <motion.div className="absolute top-[30%] right-[30px] sm:top-[50px] sm:right-[40px] lg:top-[150px] md:top-[20%] md:right-[50px] lg:right-[30px] w-[120px] sm:w-[200px] lg:w-[150px] xl:w-[200px]  h-auto">
          <motion.div
            className="absolute inset-0 bg-[] transform translate-x-[40px] translate-y-[40px]"
            ref={ref}
            style={{ x: xTransform, y: yTransform }}
          >
            <img
              src="./landing2.png "
              className="relative rounded-2xl shadow-lg z-[30] w-full h-auto"
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-[] transform translate-x-[20px] translate-y-[20px]"
            ref={ref}
            style={{ x: xTransform1, y: yTransform1 }}
          >
            <img
              src="./landing2.png"
              className="relative rounded-2xl shadow-lg z-[30] w-full h-auto"
            />
          </motion.div>
          <img
            src="./landing2.png"
            className="relative rounded-2xl shadow-lg w-full h-auto"
          />
          <div className="absolute top-[-10px] left-[-20px] z-[40]">
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
          <div className="absolute bottom-[-20px] right-[-10px] z-[40]">
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
        </motion.div>

        <div className="absolute bottom-[0px] right-[0px] w-[120px] sm:w-[200px] h-auto">
          <div className="absolute left-[-50px] bottom-[0px] z-[40] ">
            <motion.img src="./hero5.svg" className="w-[50px]" />
          </div>
          <img
            src="./Graph.png"
            className="relative rounded-2xl shadow-lg w-full h-auto"
          />
          <div className="absolute top-[-20px] left-[40px] z-[40]">
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
      </motion.div>
    </div>
  );
};

export default Hero;
