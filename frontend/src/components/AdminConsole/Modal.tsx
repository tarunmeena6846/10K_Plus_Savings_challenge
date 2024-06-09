import React, { useState } from "react";

function Modal({ event, onClose, onDelete, onEdit }) {
  const [newTitle, setNewTitle] = useState(event.title);

  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(newTitle);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="mb-4 text-xl">Edit Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Event Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
          >
            Delete Event
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default Modal;
