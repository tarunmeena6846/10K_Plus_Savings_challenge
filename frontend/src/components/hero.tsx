import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { userState } from "./store/atoms/user";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

const Hero = ({ scrollProjectedDataSection }) => {
  const navigate = useNavigate();
  const [currentUserState] = useRecoilState(userState);

  // Refs for images
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);

  // Scroll tracking for each image
  const { scrollYProgress: scrollYProgress1 } = useScroll({
    target: ref1,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: scrollYProgress2 } = useScroll({
    target: ref2,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: scrollYProgress3 } = useScroll({
    target: ref3,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: scrollYProgress4 } = useScroll({
    target: ref4,
    offset: ["start end", "end start"],
  });

  // Transformations for each image with different ranges
  const xTransform1 = useTransform(scrollYProgress1, [0.7, 0], [50, 0]);
  const yTransform1 = useTransform(scrollYProgress1, [0.7, 0], [50, 0]);

  const xTransform2 = useTransform(scrollYProgress2, [0.8, 0], [70, 0]);
  const yTransform2 = useTransform(scrollYProgress2, [0.8, 0], [70, 0]);

  const xTransform3 = useTransform(scrollYProgress3, [0.9, 0], [90, 0]);
  const yTransform3 = useTransform(scrollYProgress3, [0.9, 0], [90, 0]);

  const xTransform4 = useTransform(scrollYProgress4, [0.85, 0], [100, 0]);
  const yTransform4 = useTransform(scrollYProgress4, [0.85, 0], [100, 0]);

  // const xTransform = useTransform(scrollYProgress1, [0.7, 0], [50, 0]); // Adjust the range as needed
  // const yTransform = useTransform(scrollYProgress, [0.7, 0], [50, 0]);
  // const xTransform1 = useTransform(scrollYProgress, [0.7, 0], [30, 0]); // Adjust the range as needed
  // const yTransform1 = useTransform(scrollYProgress, [0.7, 0], [30, 0]); // Adjust the range as needed
  // const xTransform2 = useTransform(scrollYProgress, [0.7, 0], [10, 0]); // Adjust the range as needed
  // const yTransform2 = useTransform(scrollYProgress, [0.7, 0], [10, 0]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 py-10 gap-10 min-h-screen">
      {/* Left Section */}
      <div className="col-span-1 lg:col-span-5 flex justify-center items-start lg:mt-[170px] 2xl:mt-[400px] text-left">
        <div>
          <h1 className="mb-4 font-bold text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-6xl 2xl:text-8xl">
            Empower Your <br />
            <span className="text-[#6d94ff]">Financial Journey</span>
          </h1>
          <div className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-2xl text-white mt-6 md:mt-8">
            A proven program that empowers you to become a master saver and save
            $10K+ year-after-year.
          </div>
          <motion.button
            whileHover={{ background: "#b3f5a0" }}
            className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-md md:text-lg lg:text-lg text-black rounded-full mt-6 lg:mt-8 mx-auto lg:mx-0"
            style={{ background: "#6d94ff" }}
            onClick={() => {
              currentUserState.userEmail
                ? navigate("/dashboard")
                : scrollProjectedDataSection();
            }}
          >
            Get Started
          </motion.button>
        </div>
      </div>

      {/* Right Section with Overlapping Images */}
      <div className="col-span-1 lg:col-span-7 grid grid-cols-6 grid-rows-6 gap-4">
        {/* Image 1 */}
        <div className="col-start-1 col-end-4 row-start-1 row-end-4 relative lg:row-span-2">
          <motion.img
            ref={ref1}
            style={{ x: xTransform1, y: yTransform1 }}
            src="./landing.png"
            className="absolute top-0 left-0 rounded-2xl shadow-lg w-[80%] lg:w-[60%]"
          />
          {/* Additional images with different transforms for Image 1 */}
          <motion.img
            ref={ref1}
            style={{ x: xTransform1, y: yTransform1 }} // Apply diagonal movement
            src="./landing.png"
            className="absolute top-0 left-0 ml-3 mt-3 rounded-2xl shadow-lg w-[80%] lg:w-[60%]"
          />
          <motion.img
            ref={ref1}
            style={{ x: xTransform1, y: yTransform1 }} // Apply diagonal movement
            src="./landing.png"
            className="absolute top-0 left-0 ml-6 mt-6 rounded-2xl shadow-lg w-[80%] lg:w-[60%]"
          />
          <div className="absolute top-10 left-10 z-[40]">
            <motion.img
              src="./hero1.svg"
              className="w-8 md:w-14"
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

        {/* Image 2 */}
        <div className="col-start-4 col-end-7 row-start-1 row-end-4 relative">
          <motion.img
            ref={ref2}
            style={{ x: xTransform2, y: yTransform2 }}
            src="./landing1.png"
            className="absolute top-0 right-0 rounded-2xl shadow-lg w-[80%] lg:w-[60%]"
          />
          <motion.img
            ref={ref2}
            style={{ x: xTransform2, y: yTransform2 }} // Apply diagonal movement
            src="./landing1.png"
            className="absolute top-0 right-0 mr-5 mt-5 rounded-2xl shadow-lg w-[80%] lg:w-[60%]"
          />
          <motion.img
            ref={ref2}
            style={{ x: xTransform2, y: yTransform2 }} // Apply diagonal movement
            src="./landing1.png"
            className="absolute top-0 right-0 mr-10 mt-10 rounded-2xl shadow-lg w-[80%] lg:w-[60%]"
          />
          <div className="absolute top-20 right-[-10px] z-[40]">
            <motion.img
              src="./hero3.svg"
              className="w-12"
              // style={{ x: xTransform2, y: yTransform2 }} // Apply diagonal movement
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
          {/* Additional images with different transforms for Image 2 */}
        </div>

        {/* Image 3 */}
        <div className="col-start-1 col-end-4 row-start-4 row-end-7 relative">
          <motion.img
            ref={ref3}
            style={{ x: xTransform3, y: yTransform3 }}
            src="./landing2.png"
            className="absolute top-0 right-0 rounded-2xl shadow-lg w-[80%] lg:w-[60%]"
          />
          <motion.img
            ref={ref3}
            style={{ x: xTransform3, y: yTransform3 }} // Apply diagonal movement
            src="./landing2.png"
            className="absolute top-0 right-0 mr-5 mt-5 rounded-2xl shadow-lg w-[80%] lg:w-[60%]"
          />
          <motion.img
            ref={ref3}
            style={{ x: xTransform3, y: yTransform3 }} // Apply diagonal movement
            src="./landing2.png"
            className="absolute top-0 right-0 mr-10 mt-10 rounded-2xl shadow-lg w-[80%] lg:w-[60%]"
          />
          <div className="absolute top-[50px] right-[20px] z-[40]">
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
          {/* Additional images with different transforms for Image 3 */}
        </div>

        {/* Image 4 */}
        <div className="col-start-5 col-end-7 row-start-6 row-end-7 relative">
          <motion.img
            ref={ref4}
            style={{ x: xTransform4, y: yTransform4 }}
            src="https://static.wixstatic.com/media/c837a6_2ca1ce635139483099d7a4d8210fe109~mv2.jpg"
            className="rounded-2xl shadow-lg w-[80%] lg:w-[100%]"
          />
          <div className="absolute top-[40px] right-[40px] z-[40]">
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
