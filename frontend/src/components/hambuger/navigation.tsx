import * as React from "react";
import { motion } from "framer-motion";
import { MenuItem } from "./menuItem";
import { Link } from "react-router-dom";

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};
export const Navigation = () => {
  return (
    <motion.ul className="flex flex-col p-4 space-y-4">
      <motion.li whileHover={{ scale: 1.1 }}>
        <Link to="/home">Home</Link>
      </motion.li>
      <motion.li whileHover={{ scale: 1.1 }}>
        <Link to="/pricing">Pricing</Link>
      </motion.li>
      {/* Add dropdown or other menu items here */}
    </motion.ul>
  );
};
