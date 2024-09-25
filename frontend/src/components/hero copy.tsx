import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { userState } from "./store/atoms/user";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

const Hero = ({ scrollProjectedDataSection }) => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["center end", "start start"],
  });
  console.log(scrollYProgress);
  // Create diagonal motion by transforming both x and y axes
  const xTransform = useTransform(scrollYProgress, [0.7, 0], [50, 0]); // Adjust the range as needed
  const yTransform = useTransform(scrollYProgress, [0.7, 0], [50, 0]);
  const xTransform1 = useTransform(scrollYProgress, [0.7, 0], [30, 0]); // Adjust the range as needed
  const yTransform1 = useTransform(scrollYProgress, [0.7, 0], [30, 0]); // Adjust the range as needed

  const xTransform2 = useTransform(scrollYProgress, [0.7, 0], [10, 0]); // Adjust the range as needed
  const yTransform2 = useTransform(scrollYProgress, [0.7, 0], [10, 0]);

  // const marginRight = useTransform(scrollYProgress, [1, 0], ["100px", "100px"]);

  // return (
  //   <div
  //     // ref={container}
  //     className="flex flex-col lg:flex-row justify-center py-10 lg:py-10 gap-10 "
  //   >
  //     {/* Left Section */}
  //     <div className="w-full lg:w-1/2 mt-10 lg:mt-20 2xl:mt-[100px] md:px-0">
  //       <h1 className="mb-4 font-bold md:text-left text-6xl lg:text-6xl xl:text-7xl 2xl:text-7xl">
  //         Empower Your <br />
  //         <span className="text-[#6d94ff]">Financial Journey</span>
  //       </h1>
  //       <div className="3xl:text-4xl xl:text-3xl 2xl:text-2xl lg:text-2xl text-xl text-white flex-wrap mt-6 md:mt-8 lg:text-left">
  //         A proven program that empowers you to become a master saver and save
  //         $10K+ year-after-year.
  //       </div>
  //       <motion.button
  //         whileHover={{ background: "#b3f5a0" }}
  //         className="px-6 py-3 text-base lg:text-lg 3xl:text-2xl text-black rounded-3xl mb-10 mt-5 lg:mt-4 mx-auto lg:mx-0"
  //         style={{ background: "#6d94ff" }}
  //         onClick={() => {
  //           currentUserState.userEmail
  //             ? navigate("/dashboard")
  //             : scrollProjectedDataSection();
  //         }}
  //       >
  //         Get Started
  //       </motion.button>
  //     </div>

  //     {/* Right Section */}
  //     <motion.div className="w-full lg:w-1/2  relative px-5 md:px-0 h-auto">
  //       <motion.div
  //         className="top-[-50px] left-[10px] w-[120px] sm:w-[200px] lg:w-[150px] xl:w-[200px] lg:top-[0px] lg:left-[0px]"
  //         // ref={ref}
  //         // style={{ x: xTransform, y: yTransform }} // Apply diagonal movement
  //       >
  //         <motion.div
  //           className="absolute inset-0 bg-[] transform translate-x-[40px] translate-y-[40px]"
  //           ref={ref}
  //           style={{ x: xTransform, y: yTransform }}
  //         >
  //           <img
  //             src="./landing.png"
  //             className="relative rounded-2xl shadow-lg z-[30] w-full h-auto"
  //           />
  //         </motion.div>
  //         <motion.div
  //           className="absolute inset-0 bg-[] transform translate-x-[20px] translate-y-[20px]"
  //           ref={ref}
  //           style={{ x: xTransform1, y: yTransform1 }}
  //         >
  //           <img
  //             src="./landing.png"
  //             className="relative rounded-2xl shadow-lg z-[30] w-full h-auto"
  //           />
  //         </motion.div>

  //         <img
  //           src="./landing.png"
  //           className="relative rounded-2xl shadow-lg z-[30] w-full h-auto"
  //         />
  //         <div className="absolute bottom-10 left-0 z-[40]">
  //           <motion.img
  //             src="./hero1.svg"
  //             className="w-8 md:w-10"
  //             animate={{
  //               y: [0, 20, 0], // Moves 20px to the right and then back
  //             }}
  //             transition={{
  //               duration: 3, // Duration of one complete cycle (to-and-fro)
  //               repeat: Infinity, // Infinite repeat
  //               ease: "easeInOut", // Easing function for smooth motion
  //             }}
  //           />
  //         </div>
  //       </motion.div>

  //       <div
  //         className=" bottom-[0px] left-[0px] w-[120px] md:bottom-[60px] sm:right-[40px] sm:bottom-[40px] lg:left-[0px]  sm:w-[200px] lg:w-[150px] xl:w-[200px]  h-auto"
  //         // ref={ref}
  //         // style={{ x: xTransform, y: yTransform }} // Apply diagonal movement
  //       >
  //         <motion.div
  //           className="absolute inset-0 bg-[] transform translate-x-[40px] translate-y-[40px]"
  //           ref={ref}
  //           style={{ x: xTransform, y: yTransform }}
  //         >
  //           <img
  //             src="./landing1.png"
  //             className="relative rounded-2xl shadow-lg z-[30] w-full h-auto"
  //           />
  //         </motion.div>
  //         <motion.div
  //           className="absolute inset-0 bg-[] transform translate-x-[20px] translate-y-[20px]"
  //           ref={ref}
  //           style={{ x: xTransform1, y: yTransform1 }}
  //         >
  //           <img
  //             src="./landing1.png"
  //             className="relative rounded-2xl shadow-lg z-[30] w-full h-auto"
  //           />
  //         </motion.div>
  //         <img
  //           src="./landing1.png"
  //           className="relative rounded-3xl shadow-lg z-[30] w-full h-auto"
  //         />
  //         {/* <div className="absolute bottom-[-100px] right-[-100px] z-[100] md:w-[200px]">
  //           <motion.img src="./hero5.svg" className="w-8 md:w-10" />
  //         </div> */}
  //       </div>

  //       <motion.div className=" top-[30%] right-[30px] sm:top-[50px] sm:right-[40px] lg:top-[150px] md:top-[20%] md:right-[50px] lg:right-[30px] w-[120px] sm:w-[200px] lg:w-[150px] xl:w-[200px]  h-auto">
  //         <motion.div
  //           className="absolute inset-0 bg-[] transform translate-x-[40px] translate-y-[40px]"
  //           ref={ref}
  //           style={{ x: xTransform, y: yTransform }}
  //         >
  //           <img
  //             src="./landing2.png "
  //             className="relative rounded-2xl shadow-lg z-[30] w-full h-auto"
  //           />
  //         </motion.div>
  //         <motion.div
  //           className="absolute inset-0 bg-[] transform translate-x-[20px] translate-y-[20px]"
  //           ref={ref}
  //           style={{ x: xTransform1, y: yTransform1 }}
  //         >
  //           <img
  //             src="./landing2.png"
  //             className="relative rounded-2xl shadow-lg z-[30] w-full h-auto"
  //           />
  //         </motion.div>
  //         <img
  //           src="./landing2.png"
  //           className="relative rounded-2xl shadow-lg w-full h-auto"
  //         />
  //         <div className="absolute top-[-10px] left-[-20px] z-[40]">
  //           <motion.img
  //             src="./hero2.svg"
  //             className="w-16 md:w-20"
  //             animate={{
  //               rotate: 360, // Rotate the image to complete the circle
  //             }}
  //             transition={{
  //               duration: 8, // Duration of one full circle
  //               ease: "linear", // Smooth motion
  //               repeat: Infinity, // Infinite loop
  //             }}
  //           />
  //         </div>
  //         <div className="absolute bottom-[-20px] right-[-10px] z-[40]">
  //           <motion.img
  //             src="./hero3.svg"
  //             className="w-10 md:w-12"
  //             animate={{
  //               y: [0, 20, 0], // Moves 20px to the right and then back
  //             }}
  //             transition={{
  //               duration: 3, // Duration of one complete cycle (to-and-fro)
  //               repeat: Infinity, // Infinite repeat
  //               ease: "easeInOut", // Easing function for smooth motion
  //             }}
  //           />
  //         </div>
  //       </motion.div>

  //       <div className=" bottom-[0px] right-[0px] w-[120px] sm:w-[200px] h-auto">
  //         <div className="absolute left-[-50px] bottom-[0px] z-[40] ">
  //           <motion.img src="./hero5.svg" className="w-[50px]" />
  //         </div>
  //         <img
  //           src="./Graph.png"
  //           className="relative rounded-2xl shadow-lg w-full h-auto"
  //         />
  //         <div className="absolute top-[-20px] left-[40px] z-[40]">
  //           <motion.img
  //             src="./hero4.svg"
  //             className="w-8 md:w-10"
  //             animate={{
  //               y: [0, 20, 0], // Moves 20px to the right and then back
  //             }}
  //             transition={{
  //               duration: 3, // Duration of one complete cycle (to-and-fro)
  //               repeat: Infinity, // Infinite repeat
  //               ease: "easeInOut", // Easing function for smooth motion
  //             }}
  //           />
  //         </div>
  //       </div>
  //     </motion.div>
  //   </div>
  // );
  return (
    // <div className="flex flex-col md:flex-row justify-center py-10 lg:py-10 gap-10 ">
    <div className="grid  grid-cols-1 lg:grid-cols-12 py-10 lg:py-10 gap-10 min-h-screen ">
      {/* Left Section */}
      {/* <div className="w-full lg:w-1/2 mt-10 lg:mt-20 2xl:mt-[100px] md:px-0 text-left lg:text-left"> */}
      <div className="col-span-1 lg:col-span-5 flex justify-center lg:justify-start items-center lg:mt-[-70px] text-left">
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

      {/* Right Section with Images */}
      {/* Right Section with Images */}
      {/* Right Section with Images */}
      <div className="col-span-1 lg:col-span-7 grid grid-cols-2 lg:grid-cols-2 gap-16">
        {/* Image 1 */}
        <div className="flex w-[80%] lg:w-[80%] items-end relative">
          {/* First Image */}
          <motion.div
            className="absolute top-0 left-0 w-[80%] lg:w-[80%] transform translate-x-[10%] translate-y-[10%] rounded-2xl shadow-lg z-[10]"
            ref={ref}
            style={{ x: xTransform, y: yTransform }}
          >
            <img src="./landing.png" className="rounded-2xl shadow-lg" />
          </motion.div>

          {/* Second Image */}
          <motion.div
            className="absolute top-0 left-0 w-[80%] lg:w-[80%] transform translate-x-[20%] translate-y-[20%] rounded-2xl shadow-lg z-[20]"
            ref={ref}
            style={{ x: xTransform1, y: yTransform1 }}
          >
            <img
              src="./landing.png"
              className="relative rounded-2xl shadow-lg"
            />
          </motion.div>

          {/* Third Image */}
          <motion.div
            className="absolute top-0 left-0 w-[80%] lg:w-[80%] transform translate-x-[30%] translate-y-[30%] rounded-2xl shadow-lg z-[30]"
            ref={ref}
            style={{ x: xTransform2, y: yTransform2 }}
          >
            <img
              src="./landing.png"
              className="relative rounded-2xl shadow-lg"
            />
          </motion.div>
        </div>

        {/* Image 2 */}
        <img
          className="w-[80%] rounded-3xl z-[5] relative"
          src="https://static.wixstatic.com/media/c837a6_631b17d4c1f349bbaf2c909733bd94c7~mv2.jpg"
          alt="Joyful family"
        />

        {/* Image 3 */}
        <img
          className="rounded-3xl relative z-[15]"
          src="https://static.wixstatic.com/media/c837a6_b6e46ed9750d4625a7a9948f9e91557f~mv2.jpg"
          alt="Rectangle artwork"
        />

        {/* Image 4 */}
        <div className="flex items-end relative">
          <img
            className="rounded-3xl z-[5]"
            src="https://static.wixstatic.com/media/c837a6_2ca1ce635139483099d7a4d8210fe109~mv2.jpg"
            alt="Graph"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
