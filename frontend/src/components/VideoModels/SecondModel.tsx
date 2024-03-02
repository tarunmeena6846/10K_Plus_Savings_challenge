import React from "react";
import Modal from "./Modal";

const SecondModal = ({ isOpen, onClose, handleDIYClick, handleBuyClick }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} id={"SecondModal"}>
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Choose an option:</h2>
        <button
          onClick={handleDIYClick}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          DIY
        </button>
        <button
          onClick={handleBuyClick}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Buy
        </button>
      </div>
    </Modal>
  );
};

export default SecondModal;
