import * as React from "react";
import { motion } from "framer-motion";

// Path component with motion
const Path = (props) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

export const MenuToggle = ({ toggle, isOpen, type }) => (
  <button
    onClick={toggle}
    className={`${
      isOpen
        ? `fixed ${
            type === "communityMenu" ? "bottom-[20px]" : "top-[20px]"
          } right-[30px]`
        : "relative"
    }`}
    style={{
      zIndex: 9999, // Higher z-index for overlapping
      padding: "10px", // Adjust as needed
      borderRadius: "50%", // Rounded shape for the button
    }}
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      {/* Top line */}
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" }, // Normal hamburger line
          open: { d: "M 3 16.5 L 17 2.5" }, // Cross shape
        }}
        animate={isOpen ? "open" : "closed"}
      />

      {/* Middle line */}
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 }, // Visible when closed
          open: { opacity: 0 }, // Hidden when open
        }}
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.1 }}
      />

      {/* Bottom line */}
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" }, // Normal hamburger line
          open: { d: "M 3 2.5 L 17 16.346" }, // Cross shape
        }}
        animate={isOpen ? "open" : "closed"}
      />
    </svg>
  </button>
);
