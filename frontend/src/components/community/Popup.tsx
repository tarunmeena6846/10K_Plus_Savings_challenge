import React from "react";
import { useNavigate } from "react-router-dom";
const Popup = ({ results, onClose }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-4 rounded-lg shadow-lg w-3/4 max-w-3xl max-h-[90vh] overflow-y-auto relative">
        {/* <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          &times;
        </button> */}
        <div>
          <button
            onClick={onClose}
            className="top-2 right-2 text-gray-600 hover:text-gray-900 p-2 text-3xl"
          >
            &times;
          </button>
          {results && results.length > 0 ? (
            results.map((post) => (
              <div
                key={post._id}
                className="border-b border-gray-300 p-2 text-gray-500 hover:text-black cursor-pointer"
              >
                <div>{/* <strong>ID:</strong> {post._id} */}</div>
                <div
                  className="text-3xl flex justify-between"
                  onClick={() => {
                    navigate(`/community/post/${post._id}`);
                  }}
                >
                  {post.title}
                  <div className="text-lg">{post.author}</div>
                </div>
                {/* <div className="text-sm">Post author: {post.author}</div> */}
              </div>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
