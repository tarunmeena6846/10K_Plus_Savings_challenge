import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TaskList = ({ setShowPopup }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [popupWidth, setPopupWidth] = useState(500);
  const [popupHeight, setPopupHeight] = useState(300);
  const [isChecked, setIsChecked] = useState(false);

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };
  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, newTask]);
      setNewTask("");
    }
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleResize = (e) => {
    setPopupWidth(e.target.offsetWidth);
    setPopupHeight(e.target.offsetHeight);
  };
  return (
    <div className="max-w-lg mx-auto mt-8 relative">
      <motion.div
        className="task-list-popup fixed bottom-5 right-2 bg-white border border-gray-300 rounded shadow-lg p-4 overflow-y-auto max-h-80"
        style={{ width: popupWidth, height: popupHeight }}
        drag
        dragConstraints={{
          left: 0,
          right: 0,
          top: popupHeight - window.innerHeight,
          bottom: 0,
        }}
        dragElastic={0.1}
        onResize={handleResize}
        onClick={(e) => e.stopPropagation()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="p-4">
          <motion.button
            className="py-2 px-4 rounded absolute top-0 right-0"
            onClick={() => {
              setShowPopup(false);
            }}
          >
            <img className="" src={"cancel.svg"} alt="Cancel" />
          </motion.button>
        </div>
        <div className="flex items-center mb-4 mt-4">
          <input
            type="text"
            className="w-full py-2 px-3 mr-2 border border-gray-300 rounded"
            placeholder="Enter a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <motion.button
            className="bg-black text-white rounded-3xl p-2"
            onClick={handleAddTask}
          >
            +Task
          </motion.button>
        </div>
        <ul>
          {tasks.map((task, index) => (
            <motion.li
              key={index}
              className="flex items-center justify-between border-b border-gray-300 py-2"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <span>{task}</span>
              <motion.button
                className="text-red-500 hover:text-red-600"
                onClick={() => handleRemoveTask(index)}
              >
                <img className="" src={"cancel.svg"} alt="Cancel" />
              </motion.button>
            </motion.li>
          ))}
        </ul>
        <div className="mt-2">
          <motion.label
            className="checkbox-container mr-3"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={toggleCheckbox}
            />
            <motion.span
              className="checkmark"
              variants={{
                checked: { scaleX: 1, opacity: 1 },
                unchecked: { scaleX: 0, opacity: 0 },
              }}
              initial={isChecked ? "checked" : "unchecked"}
              animate={isChecked ? "checked" : "unchecked"}
              transition={{ duration: 0.2 }}
            />
          </motion.label>
          Set Remider for Accomplishing the Tasks.
        </div>
      </motion.div>
    </div>
  );
};

export default TaskList;
