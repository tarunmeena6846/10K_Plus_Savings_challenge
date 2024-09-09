import * as React from "react";
import { useRef } from "react";
import { motion, useCycle } from "framer-motion";
import { useDimensions } from "./useDimension"; // Assuming this custom hook exists
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./navigation";

const sidebarVariants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

export const AnimatedSidebar = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef); // Hook to get container height

  return (
    <motion.nav
      className="fixed top-0 left-0 bottom-0 z-50"
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      ref={containerRef}
    >
      <motion.div
        className="background bg-[#eaeaea]"
        variants={sidebarVariants}
      />
      <Navigation /> {/* Your navigation links go here */}
      <MenuToggle toggle={() => toggleOpen()} />
    </motion.nav>
  );
};
