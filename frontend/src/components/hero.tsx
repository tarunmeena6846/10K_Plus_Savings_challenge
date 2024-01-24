import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import classNames from "classnames";

const Hero = () => {
  // const [isScrolled, setIsScrolled] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const documentRef = useRef(document);
  const isInView = useInView(ref, {
    margin: "-50% 0px -50% 0px",
    // NOTE: The only reason we pass in the document here, is because
    // of security restrictions set by the browser when using an iFrame.
    // In an iFrame (so eg in the preview on frontend.fyi),
    // margin won't take effect unless you specify the root manually.
    // By default it will be the window element, which is what we want in this case.
    // If you specify your own root, you can usually only pass in an Element, and
    // not the document (since document/window is the default). However, in order
    // to fix the issue in the iframe, we need to pass in the document here and thus
    // tell TypeScript that we know what we're doing. If you're implementing
    // this in your own website, you can just pass in the root property as well as the documentRef.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
          `font-heading text-7xl ${isInView ? "text-black" : "text-gray-500"}`
        )}
        transition={{ duration: 0.5 }}
        style={{ marginTop: "60px" }} // Add margin to the second line
      >
        Join The 10K Plus Savings Challange and....
      </motion.span>
    </section>
  );
};

export default Hero;
