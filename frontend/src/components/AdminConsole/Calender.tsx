import FullCalendar from "@fullcalendar/react";
import React, { useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import timeGridPlugin from "@fullcalendar/timegrid";

const Calender = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [eventData, setEventData] = useState({ title: "", date: "" });
  const handleDateSelect = (selectInfo) => {
    setEventData({
      ...eventData,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
    });
    setModalOpen(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = fetch(
        `${import.meta.env.VITE_SERVER_URL}/post/addEvent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ eventData: eventData }),
        }
      );
      alert("Event created and notifications sent");
      setModalOpen(false);
    } catch (error) {
      console.error("Error creating event", error);
    }
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        weekends={false}
        initialView="dayGridMonth"
        // slotDuration={30}
        // scrollTime={6}
        selectable={true}
        select={handleDateSelect}
      />

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="mb-4 text-xl">Create Event</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Event Title</label>
                <input
                  type="text"
                  value={eventData.title}
                  onChange={(e) =>
                    setEventData({ ...eventData, title: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Create Event
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calender;
