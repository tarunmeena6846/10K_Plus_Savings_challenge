import React, { useState } from "react";

const TextFieldWithDropdown = ({ setTags }) => {
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const options = ["Option 1", "Option 2", "Option 3"];

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setTags(e.target.value);
  };

  const handleDropdownClick = (option) => {
    setInputValue(option);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setShowDropdown(false)}
        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500"
      />
      {showDropdown && (
        <div className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleDropdownClick(option)}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextFieldWithDropdown;
