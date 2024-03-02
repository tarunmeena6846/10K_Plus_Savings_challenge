import React from "react";

const Modal = ({ isOpen, onClose, children, id }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="relative bg-white rounded-lg shadow-lg p-4">
            {children}
            {id != "SecondModal" && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
