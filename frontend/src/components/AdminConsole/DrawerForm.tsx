import React, { useState, useEffect } from "react";
import PopupModal from "../DeletePopup";

const DrawerForm = ({
  drawerVisible,
  setDrawerVisible,
  setEventDetails,
  eventDetails,
  handleSave,
  handleDeleteEvent,
  deletePopup,
  setDeletePopup,
}) => {
  const { title, startTime, endTime, date, description } = eventDetails;
  console.log(description);
  // const [deletePopup, setDeletePopup] = useState(false);
  // Function to generate time options
  const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0");
      times.push(`${hour}:00`, `${hour}:30`);
    }
    return times;
  };

  // Function to generate end time options based on start time
  const generateEndTimeOptions = (startTime) => {
    const times = generateTimeOptions();
    if (startTime) {
      const [startHour, startMinute] = startTime.split(":").map(Number);
      return times.filter((time) => {
        const [hour, minute] = time.split(":").map(Number);
        return hour > startHour || (hour === startHour && minute > startMinute);
      });
    }
    return times;
  };

  // State to store time options for both start and end times
  const [startTimeOptions, setStartTimeOptions] = useState(
    generateTimeOptions()
  );
  const [endTimeOptions, setEndTimeOptions] = useState(
    generateEndTimeOptions(startTime)
  );

  // Update end time options when start time or end time changes
  useEffect(() => {
    setEndTimeOptions(generateEndTimeOptions(startTime));
    if (endTime && !generateEndTimeOptions(startTime).includes(endTime)) {
      setEventDetails((prev) => ({ ...prev, endTime: "" })); // Clear endTime if it's no longer valid
    }
  }, [startTime, endTime]);

  // Toggle drawer visibility
  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <div
      id="drawer-form"
      className={`fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform bg-white w-80 dark:bg-gray-800 ${
        drawerVisible ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-labelledby="drawer-label"
    >
      <div className="flex justify-between items-center">
        <h5
          id="drawer-label"
          className="flex items-center  text-base font-semibold text-gray-500 uppercase dark:text-gray-400 "
        >
          <svg
            className="w-3.5 h-3.5 mr-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm14-7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z" />
          </svg>
          New event
        </h5>
        <div className="flex flex-row gap-3">
          {title.length > 0 && (
            <button
              type="button"
              onClick={() => setDeletePopup(true)}
              className="text-gray-400  hover:bg-gray-200 w-[30px] hover:text-gray-900 rounded-lg "
            >
              <img src="./delete.svg"></img>
            </button>
          )}
          <button
            type="button"
            onClick={toggleDrawer}
            className="text-gray-400 bg-transparent hover:bg-gray-200  p-3 rounded-3xl  hover:text-gray-900"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            {/* <span className="sr-only">Close menu</span> */}
          </button>
        </div>
      </div>
      <form className="mb-6 mt-5">
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Title"
            required
            onChange={(e) =>
              setEventDetails((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) =>
              setEventDetails({
                ...eventDetails,
                description: e.target.value,
              })
            }
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write event description..."
          ></textarea>
        </div>
        <div className="flex flex-row mb-6 justify-between">
          <label
            htmlFor="startTime"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Event Start Time
          </label>
          <div className="flex items-center gap-1">
            <img src="./calender1.svg" alt="calendar" className="w-5 h-5" />
            <select
              id="startTime"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={startTime}
              onChange={(e) => {
                const newStartTime = e.target.value;
                setEventDetails((prev) => ({
                  ...prev,
                  startTime: newStartTime,
                  endTime: "", // Reset endTime when startTime changes
                }));
              }}
            >
              {startTimeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-row mb-6 justify-between">
          <label
            htmlFor="endTime"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Event End Time
          </label>
          <div className="flex items-center gap-1">
            <img src="./calender1.svg" alt="calendar" className="w-5 h-5" />
            <select
              id="endTime"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={endTime}
              onChange={(e) =>
                setEventDetails((prev) => ({
                  ...prev,
                  endTime: e.target.value,
                }))
              }
            >
              {endTimeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={handleSave}
        >
          Save
        </button>
      </form>
      {deletePopup && (
        <PopupModal
          isModalOpen={setDeletePopup}
          setIsModalOpen={setDeletePopup}
          handleDelete={handleDeleteEvent}
          type={"delete"}
        ></PopupModal>
      )}
    </div>
  );
};

export default DrawerForm;
