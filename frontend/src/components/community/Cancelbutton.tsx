import React from "react";

const CancelButton = ({ onClose }) => {
  return (
    <button
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "10px",
      }}
      onClick={onClose}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        style={{ width: "24px", height: "24px" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

export default CancelButton;
