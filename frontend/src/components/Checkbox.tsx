import React from "react";

const CheckBox = ({ isChecked, setIsChecked }) => {
  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };
  return (
    <>
      <input type="checkbox" checked={isChecked} onChange={toggleCheckbox} />
    </>
  );
};

export default CheckBox;
