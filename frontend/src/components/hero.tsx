import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const getRandomPosition = (maxWidth, maxHeight) => {
  const left = Math.floor(Math.random() * maxWidth);
  const top = Math.floor(Math.random() * maxHeight);
  return { left, top };
};
const Hero = () => {
  // const containerRef = useRef(null);

  // useEffect(() => {
  //   const container = containerRef.current;
  //   const containerWidth = container.offsetWidth;
  //   const containerHeight = container.offsetHeight;

  //   const images = container.querySelectorAll("img");
  //   images.forEach((img) => {
  //     const { left, top } = getRandomPosition(
  //       containerWidth - img.width,
  //       containerHeight - img.height
  //     );
  //     img.style.position = "absolute";
  //     img.style.left = `${left}px`;
  //     img.style.top = `${top}px`;
  //   });
  // }, []);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollY = window.scrollY;
  //     // Adjust the threshold based on your preference
  //     const scrollThreshold = 100;

  //     setIsScrolled(scrollY > scrollThreshold);
  //   };

  //   // Add this check to ensure it runs only on the client side
  //   if (typeof window !== "undefined") {
  //     window.addEventListener("scroll", handleScroll);

  //     return () => {
  //       window.removeEventListener("scroll", handleScroll);
  //     };
  //   }
  // }, []);

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
        >
          Get Started
        </motion.button>
      </div>
      <div className="w-1/2 h-screen relative">
        <div className="absolute top-[-110px] left-[10px] w-40 h-30">
          <div className="absolute inset-0 bg-[#e9a0b0] rounded-2xl transform translate-x-2 translate-y-2"></div>
          <div className="absolute inset-0 bg-[#e9a0b0] rounded-2xl transform translate-x-4 translate-y-4"></div>
          <img src="./landing.png" className="relative rounded-2xl shadow-lg" />
        </div>

        <div className="absolute bottom-[130px] left-[50px] w-40 ">
          <div className="absolute inset-0 bg-[#75bcda] rounded-2xl transform translate-x-2 translate-y-2"></div>
          <div className="absolute inset-0 bg-[#75bcda] rounded-2xl transform translate-x-4 translate-y-4"></div>
          <img
            src="./landing1.png"
            className="relative rounded-2xl shadow-lg"
          />
        </div>

        <div className="absolute top-[30px] right-[50px] w-40">
          <div className="absolute inset-0 bg-[#f08517] rounded-2xl transform translate-x-2 translate-y-2"></div>
          <div className="absolute inset-0 bg-[#f08517] rounded-2xl transform translate-x-4 translate-y-4"></div>
          <img
            src="./landing2.png"
            className="relative rounded-2xl shadow-lg"
          />
        </div>

        <div className="absolute bottom-[70px] right-[50px] w-40">
          <img src="./Graph.png" className="relative rounded-2xl shadow-lg" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
