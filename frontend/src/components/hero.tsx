import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import classNames from "classnames";

const Hero = () => {
  // const [isScrolled, setIsScrolled] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const documentRef = useRef(document);
  const isInView = useInView(ref, {
    margin: "-50% 0px -50% 0px",
    // @ts-ignore
    root: documentRef,
  });
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
    <section className="flex flex-col justify-center py-20">
      <h1 className="mb-4 font-heading text-7xl">
        Empower your financial journey, achieve annual savings goals.
      </h1>
      <motion.span
        ref={ref}
        className={classNames(
          `font-heading text-7xl ${isInView ? "text-white" : "text-gray-400"}`
        )}
        transition={{ duration: 0.5 }}
        style={{ marginTop: "60px" }} // Add margin to the second line
      >
        Join the 10k Savings Challenge, a proven program that empowers you to
        become a master saver and save $10K+ year-after-year.
      </motion.span>
    </section>
  );
};

export default Hero;
