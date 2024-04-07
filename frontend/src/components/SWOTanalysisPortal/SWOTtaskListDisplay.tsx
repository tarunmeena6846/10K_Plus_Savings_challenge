import React, { useEffect, useState } from "react";
import { taskDetails } from "./Tasklist";
import { motion } from "framer-motion";
export default function SWOTtasklist() {
  const [taskList, setTaskList] = useState<taskDetails[]>();
  const [isChecked, setIsChecked] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [taskPerPage] = useState(10);
  const handleCheckboxChange = (taskId) => {
    setIsChecked(!isChecked);
    if (completedTasks.includes(taskId)) {
      // If task is already marked as completed, remove it from the array
      setCompletedTasks(completedTasks.filter((id) => id !== taskId));
    } else {
      // If task is not marked as completed, add it to the array
      setCompletedTasks([...completedTasks, taskId]);
    }
  };
  const indexOfLastStock = currentPage * taskPerPage;
  const indexOfFirstStock = indexOfLastStock - taskPerPage;

  const handleBulkUpdate = (type: string) => {
    console.log(completedTasks, type);
    // setIsChecked(!isChecked);
    // Send a request to your backend server to update tasks in bulk
    fetch(`${import.meta.env.VITE_SERVER_URL}/swot/bulk-update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ taskIds: completedTasks, type: type }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response is not ok");
        }
        response.json().then((data) => {
          if (data.success) {
            console.log("tasks updated successfully");
          }
        });
      })
      .catch((error) => {
        console.error("Error updating tasks in bulk:", error);
      });
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/swot/get-task-list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Network reponse is not ok");
        }

        resp.json().then((data) => {
          if (data.success) {
            console.log(data.data);
            setTaskList(data.data.tasks);
          } else {
            console.error("TaskList empty");
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching the tasklist");
      });
  }, []);
  const currentTasks = taskList?.slice(indexOfFirstStock, indexOfLastStock);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setIsChecked(isChecked);
    if (isChecked) {
      const allTaskIds = taskList.map((task) => task._id);
      setCompletedTasks(allTaskIds);
    } else {
      setCompletedTasks([]);
    }
  };
  console.log(taskList);
  return (
    <div className="pt-10">
      {isChecked && (
        <div className="flex justify-end p-2">
          <motion.button
            className="p-2 bg-green-500 text-white rounded-md mr-2"
            onClick={() => handleBulkUpdate("complete")}
          >
            Complete
          </motion.button>
          <motion.button
            className="p-2 bg-red-500 text-white rounded-md"
            onClick={() => handleBulkUpdate("delete")}
          >
            Delete
          </motion.button>
        </div>
      )}
      <div className="flex flex-col">
        <div className="flex flex-row bg-gray-200 p-2">
          <div className="flex-1">
            <input type="checkbox" onChange={handleSelectAll} />
          </div>
          <div className="flex-1">Title</div>
          <div className="flex-1">Completed</div>
        </div>
        {currentTasks?.map((task) => (
          <div
            key={task._id}
            className="flex flex-row border-t border-gray-300 p-2"
          >
            <div className="flex-1">
              <input
                type="checkbox"
                id={`task-${task._id}`}
                checked={completedTasks.includes(task._id)}
                onChange={() => handleCheckboxChange(task._id)}
              />
            </div>
            <div className="flex-1">{task.title}</div>
            <div className="flex-1">{task.isComplete.toString()}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center mt-4 space-x-2">
        {taskList && (
          <div>
            {[...Array(Math.ceil(taskList.length / taskPerPage))].map(
              (_, index) => (
                <button
                  key={index}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
