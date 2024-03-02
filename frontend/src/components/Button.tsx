import React from "react";
import { motion } from "framer-motion";

const CustomeButton = ({ children, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }} // Define hover animation
      whileTap={{ scale: 1 }} // Define hover animation
      className="rounded-3xl bg-black text-white p-2 pl-3 pr-3 mr-1 ml-1"
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default CustomeButton;
