import React from "react";
import Modal from "./Modal";

const VideoModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} id={"VideoModal"}>
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/JqYoLQXO7j4"
          title="The importance of saving money"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </div>
    </Modal>
  );
};

export default VideoModal;
