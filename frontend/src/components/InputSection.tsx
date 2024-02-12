import React, { useState } from "react";
import { motion } from "framer-motion";

const InputSection = ({ title, isOpen, onToggle, onSubmit, imageSrc }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(inputValue);
    setInputValue("");
  };

  return (
    <motion.div
      className="projected-input"
      layout
      style={{
        borderRadius: "20px",
        background: "grey",
        width: "80%",
        marginBottom: "50px",
        cursor: "pointer",
        boxShadow: "0px 10px 30px black",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "column",
      }}
      onClick={onToggle}
    >
      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ marginRight: "10px" }}>{title}</span>
        <button>
          <img
            className="arrow"
            src={isOpen ? "./up.svg" : "./down.svg"}
            alt="Dropdown arrow"
          />
        </button>
      </div>
      {isOpen && (
        <div className="flex items-center">
          <span>
            Take the first step towards financial success. Enter your target
            {title.includes("income") ? " income" : " expenses"} and pave the
            way to your dreams
          </span>
          <div>
            <motion.input
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-2 rounded"
              value={inputValue}
              onChange={handleInputChange}
            />
            <button onClick={handleSubmit}>Submit</button>
            <img src={imageSrc} alt="Target" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default InputSection;
