import React, { useEffect, useState } from "react";
import { fetchTags, tagDataType } from "./SideBar";

const TextFieldWithDropdown = ({ setProp, prop, propValues, placeholder }) => {
  const [inputValue, setInputValue] = useState(prop);
  const [showDropdown, setShowDropdown] = useState(false);
  // const [popularTags, setPopularTags] = useState<tagDataType[]>([]);
  // // const options = ["Option 1", "Option 2", "Option 3"];

  // useEffect(() => {
  //   const fetchTagsFromDB = async () => {
  //     console.log("here");
  //     try {
  //       const response = await fetchTags();
  //       console.log(response);
  //       console.log(response);
  //       setPopularTags(response);
  //     } catch (error) {
  //       console.error("Error fetching tags", error);
  //     }
  //   };
  //   fetchTagsFromDB();
  // }, []);
  const handleInputChange = (e) => {
    setShowDropdown(false);
    console.log(e.target.value);
    setInputValue(e.target.value);
    setProp(e.target.value);
  };

  const handleDropdownClick = (option) => {
    console.log(option);
    // setInputValue(option.tag);
    setProp(option);
    setShowDropdown(false);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleInputBlur = () => {
    // Delay hiding the dropdown to allow the click event to register
    setTimeout(() => {
      setShowDropdown(false);
    }, 150);
  };
  return (
    <div className="relative text-black">
      <input
        type="text"
        value={prop}
        placeholder={placeholder}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className="w-full border border-gray-300 px-4 py-2 my-2 rounded-md focus:outline-none focus:border-blue-500"
      />
      {showDropdown && (
        <div>
          {propValues.length > 0 ? (
            <div className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 overflow-y-auto h-[200px]">
              {propValues.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleDropdownClick(option)}
                  className="cursor-pointer px-4 py-2  hover:bg-gray-100"
                >
                  {option}
                </div>
              ))}
            </div>
          ) : (
            <div className="absolute p-3 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg h-10">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TextFieldWithDropdown;
