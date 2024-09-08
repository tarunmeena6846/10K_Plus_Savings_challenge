import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const Dropdown = ({ items, isOpen, onMouseEnter, onMouseLeave, navigate }) => {
  return (
    isOpen && (
      <motion.div
        className="dropdown bg-[#eaeaea] p-4 rounded-2xl border-b border-r border-l"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        style={{ position: "absolute", zIndex: 1 }}
        transition={{ duration: 0.2 }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {items.map((item, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.3, background: "black", color: "white" }}
            whileTap={{ scale: 1 }}
            className="rounded-3xl text-black pr-3 p-2 mb-2"
            onClick={() => navigate(item.route)}
          >
            {item.label}
          </motion.button>
        ))}
      </motion.div>
    )
  );
};

Dropdown.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      route: PropTypes.string.isRequired,
    })
  ).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default Dropdown;
