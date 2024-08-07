import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TextField } from "@mui/material";
import CheckBox from "../Checkbox";
export interface taskDetails {
  title: String;
  isComplete: Boolean;
  dueDate?: string;
}
const TaskList = ({ setShowPopup }) => {
  const [tasks, setTasks] = useState<taskDetails[]>([]);
  const [newTask, setNewTask] = useState<taskDetails>({
    title: "",
    isComplete: false,
  });
  const [popupWidth, setPopupWidth] = useState(500);
  const [popupHeight, setPopupHeight] = useState(300);
  const [isChecked, setIsChecked] = useState(false);
  const [onCalendarClick, setOnCalendarClick] = useState(false);
  // const handleCalenderClick = async () => {};
  const handleSaveTasks = async () => {
    console.log("tasks", tasks);
    if (tasks.length === 0) {
      alert("No tasks provided");
      return;
    }
    await fetch(`${import.meta.env.VITE_SERVER_URL}/swot/savetasklist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        tasks,
        isReminderSet: isChecked,
      }),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Network repsone is not ok");
        }
        resp.json().then((data) => {
          console.log(data);
          setTasks([]);
        });
      })
      .catch((error) => {
        console.error("Error saving tasklist");
      });
  };

  const handleAddTask = () => {
    console.log(newTask);
    if (newTask === undefined) {
      alert("Please add any tasks");
      return;
    }
    console.log("newTask", newTask);
    setOnCalendarClick(false);
    setTasks([...tasks, newTask]);
    setNewTask({ title: "", isComplete: false });
    console.log(newTask);
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
        // whileTap={{ scale: 0.95 }}
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
            className="w-3/4 py-2 px-3 mr-2 border border-gray-300 rounded"
            placeholder="Enter a new task"
            value={newTask?.title as string}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <motion.button className="py-2 px-3 mr-2">
            <img
              className=""
              src={"calender1.svg"}
              onClick={() => {
                setOnCalendarClick(!onCalendarClick);
              }}
            />
          </motion.button>
          <motion.button
            className="bg-black text-white rounded-3xl p-2"
            onClick={handleAddTask}
          >
            +Task
          </motion.button>
        </div>
        {onCalendarClick && (
          <div>
            Due Date:
            <input
              className="py-2 px-3 border border-gray-300 rounded"
              type="date"
              value={newTask.dueDate || ""}
              onChange={(e) => {
                setNewTask({
                  ...newTask,
                  dueDate: new Date(e.target.value)
                    .toISOString()
                    .substring(0, 10),
                });
              }}
            />
          </div>
        )}
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
              <div className="flex-1 overflow-hidden">
                <div className="truncate">{task.title}</div>
              </div>
              <div className="text-red-600"> {task.dueDate}</div>
              <motion.button
                className="text-red-500 hover:text-red-600"
                onClick={() => handleRemoveTask(index)}
              >
                <img className="" src={"cancel.svg"} alt="Cancel" />
              </motion.button>
            </motion.li>
          ))}
        </ul>
        <div className="mt-2 flex justify-between">
          {/* <div className="pt-2">
            <motion.label
              className="checkbox-container mr-3"
              whileHover={{ scale: 1.1 }}
              // whileTap={{ scale: 0.9 }}
            >
              <CheckBox isChecked={isChecked} setIsChecked={setIsChecked} />

              <motion.span
                className="checkmark"
                variants={{
                  checked: { scaleX: 1, opacity: 1 },
                  unchecked: { scaleX: 0, opacity: 0 },
                }}
                initial={isChecked ? "checked" : "unchecked"}
                animate={isChecked ? "checked" : "unchecked"}
                // transition={{ duration: 0.2 }}
              />
            </motion.label>
            Set Remider for Accomplishing the Tasks.
          </div> */}
          <div className="flex ">
            <motion.button
              className="bg-black text-white rounded-3xl p-2"
              onClick={handleSaveTasks}
            >
              Save
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskList;
