import React, { useEffect, useState } from "react";
import { taskDetails } from "./Tasklist";
import { motion } from "framer-motion";
import { actionsState, userState } from "../store/atoms/user";
import { useRecoilState } from "recoil";
import Loader from "../community/Loader";
import SuccessPopup from "./SuccessfulPopup";
export default function SWOTtasklist() {
  const [taskList, setTaskList] = useState<taskDetails[]>();
  const [isChecked, setIsChecked] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [taskPerPage] = useState(10);
  const [action, setAction] = useRecoilState(actionsState);
  const [selectAllEnabled, setSelectAllEnabled] = useState(false);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);

  const handleCheckboxChange = (taskId) => {
    if (selectAllEnabled) {
      setSelectAllEnabled(false);
    }
    const updatedCompletedTasks = completedTasks.includes(taskId)
      ? completedTasks.filter((id) => id !== taskId)
      : [...completedTasks, taskId];

    setCompletedTasks(updatedCompletedTasks);

    // Update `isChecked` based on whether any tasks are selected
    setIsChecked(updatedCompletedTasks.length > 0);
  };
  const indexOfLastStock = currentPage * taskPerPage;
  const indexOfFirstStock = indexOfLastStock - taskPerPage;

  const handleBulkUpdate = (type: string) => {
    console.log(completedTasks, type);
    setIsChecked(false);
    setCurrentUserState((prev) => ({ ...prev, isLoading: true }));
    // setSelectAllEnabled(false);
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
            setCurrentUserState((prev) => ({ ...prev, isLoading: false }));
            // setSuccessfulPopup(true);
            setAction((prev) => prev + 1);
            setCompletedTasks([]);
            setSelectAllEnabled(false);
          }
        });
      })
      .catch((error) => {
        console.error("Error updating tasks in bulk:", error);
      });
  };

  useEffect(() => {
    setCurrentUserState((prev) => ({ ...prev, isLoading: true }));
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
            setCurrentUserState((prev) => ({ ...prev, isLoading: false }));
            setTaskList(data.data.tasks);
          } else {
            console.error("TaskList empty");
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching the tasklist");
      });
  }, [action]);
  const currentTasks = taskList?.slice(indexOfFirstStock, indexOfLastStock);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  console.log(currentPage, currentTasks);
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    console.log(currentPage, isChecked);
    setIsChecked(isChecked);
    setSelectAllEnabled(!selectAllEnabled);
    if (isChecked) {
      const allTaskIds = currentTasks
        // .filter((task) => task.isComplete === false)
        .map((task: any) => task._id);

      console.log(allTaskIds);
      setCompletedTasks(allTaskIds);
    } else {
      setCompletedTasks([]);
    }
  };
  console.log(completedTasks);
  return (
    <div className="pt-10">
      <div className="flex justify-between items-end px-4">
        <h2 className=" text-white text-2xl pt-2">Task List</h2>
        {isChecked && (
          <div className="">
            <button
              className={`p-2 ${
                currentUserState.isLoading ? "bg-green-200" : "bg-green-500"
              } text-white rounded-md mr-2`}
              onClick={() => handleBulkUpdate("complete")}
            >
              Complete
            </button>
            <motion.button
              className={`p-2 ${
                currentUserState.isLoading ? "bg-red-200" : "bg-red-500"
              } text-white rounded-md`}
              onClick={() => handleBulkUpdate("delete")}
            >
              Delete
            </motion.button>
          </div>
        )}
      </div>
      <div className="flex flex-col mt-2 px-4">
        <div className="flex flex-row bg-gray-200 p-2">
          <div className="flex-1">
            <input
              type="checkbox"
              checked={selectAllEnabled}
              onChange={handleSelectAll}
            />
          </div>
          <div className="flex-1">Task Title</div>
          {/* <div className="flex-1">Completed</div> */}
          <div className="flex-1">Due Date</div>
        </div>
        {currentTasks?.map((task: any) =>
          currentUserState.isLoading ? (
            <Loader key={task._id} />
          ) : (
            <div
              key={task._id}
              className={`flex flex-row  border-t border-gray-300 p-2 ${
                task.isComplete ? `text-gray-400` : `text-white`
              }`}
            >
              <div className="flex-1">
                <input
                  type="checkbox"
                  id={`task-${task._id}`}
                  checked={completedTasks.includes(task._id)}
                  onChange={() => handleCheckboxChange(task._id)}
                />
              </div>
              <div className="flex-1 flex wrap">{task.title}</div>
              <div className="flex-1">{task.dueDate ? task.dueDate : "NA"}</div>
            </div>
          )
        )}
      </div>
      <div className="flex justify-center items-center mt-4 space-x-2">
        {taskList && (
          <div>
            {[...Array(Math.ceil(taskList.length / taskPerPage))].map(
              (_, index) => (
                <button
                  key={index}
                  className="px-4 mr-2 py-2 bg-blue-500 text-white rounded-md"
                  onClick={() => {
                    paginate(index + 1);
                    setSelectAllEnabled(false);
                    setIsChecked(false);
                    setCompletedTasks([]);
                  }}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        )}
      </div>
      {/* {successfulPopup && (
        <SuccessPopup
          message="Deletion successful!"
          duration={5000}
          onClose={() => setSuccessfulPopup(false)}
        />
      )} */}
    </div>
  );
}
