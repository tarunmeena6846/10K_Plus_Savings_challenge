import React, { useEffect, useState } from "react";
import { fetchTags, tagDataType } from "./SideBar";

const TextFieldWithDropdown = ({ setTags, tag }) => {
  const [inputValue, setInputValue] = useState(tag);
  const [showDropdown, setShowDropdown] = useState(false);
  const [popularTags, setPopularTags] = useState<tagDataType[]>([]);
  // const options = ["Option 1", "Option 2", "Option 3"];

  useEffect(() => {
    const fetchTagsFromDB = async () => {
      console.log("here");
      try {
        const response = await fetchTags();
        console.log(response);
        console.log(response);
        setPopularTags(response);
      } catch (error) {
        console.error("Error fetching tags", error);
      }
    };
    fetchTagsFromDB();
  }, []);
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
        value={tag}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setShowDropdown(false)}
        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500"
      />
      {showDropdown && (
        <div>
          {popularTags.length > 0 ? (
            <div className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 overflow-y-auto h-40">
              {popularTags.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleDropdownClick(option)}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  {option.tag}
                </div>
              ))}
            </div>
          ) : (
            <div className="absolute p-3 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg h-10">
              No tags available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TextFieldWithDropdown;
