import { useEffect, useState } from "react";
import { taskDetails } from "./Tasklist";
import { motion } from "framer-motion";
export default function SWOTtasklist() {
  const [taskList, setTaskList] = useState<taskDetails[]>();
  const [isChecked, setIsChecked] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);

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

  const handleBulkUpdate = (type: string) => {
    console.log(completedTasks, type);
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
  return (
    <div>
      {isChecked && (
        <div>
          <motion.button
            className="p-2"
            onClick={() => handleBulkUpdate("complete")}
          >
            Completed
          </motion.button>
          <motion.button
            className="p-2"
            onClick={() => handleBulkUpdate("delete")}
          >
            Delete
          </motion.button>
        </div>
      )}
      {taskList?.map((task) => (
        <div key={task._id}>
          <input
            type="checkbox"
            id={`task-${task._id}`}
            checked={completedTasks.includes(task._id)}
            onChange={() => handleCheckboxChange(task._id)}
          />
          <label htmlFor={`task-${task._id}`}>{task.title}</label>
        </div>
      ))}
    </div>
  );
}
