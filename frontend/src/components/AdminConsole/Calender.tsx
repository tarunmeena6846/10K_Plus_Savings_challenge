import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { createEventId } from "./event-utils";

function extractDateTime(dateTimeString) {
  const { startStr, endStr } = dateTimeString;
  const [startDate, startTimeWithOffset] = startStr.split("T");
  const [endDate, endTimeWithOffset] = endStr.split("T");

  if (!startTimeWithOffset || !endTimeWithOffset) {
    return { startTime: "", endTime: "", selectedDate: startDate };
  }

  const startTime = startTimeWithOffset
    .split("+")[0]
    .split(":")
    .slice(0, 2)
    .join(":");
  const endTime = endTimeWithOffset
    .split("+")[0]
    .split(":")
    .slice(0, 2)
    .join(":");

  return { startTime, endTime, selectedDate: startDate };
}

export default function DemoApp() {
  const calendarRef = useRef(null);
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [eventDetails, setEventDetails] = useState({
    title: "",
    startTime: "",
    endTime: "",
    description: "",
    date: "",
  });

  const handleWeekendsToggle = () => setWeekendsVisible(!weekendsVisible);

  const handleDateSelect = (selectInfo) => {
    const { clientX: x, clientY: y } = selectInfo.jsEvent;
    const { startTime, endTime, selectedDate } = extractDateTime(selectInfo);

    setEventDetails({
      title: "",
      startTime,
      endTime,
      description: "",
      date: selectedDate,
    });

    setPopupPosition({
      x: x + 500 > window.innerWidth ? window.innerWidth - 500 : x,
      y: y + 200 > window.innerHeight ? window.innerHeight - 200 : y,
    });
  };

  const handleEventSave = async (e) => {
    e.preventDefault();
    const { title, startTime, endTime, date, description } = eventDetails;

    if (title && startTime && endTime) {
      const newEvent = {
        id: createEventId(),
        title,
        start: `${date}T${startTime}:00`,
        end: `${date}T${endTime}:00`,
        allDay: false,
        description,
      };

      setCurrentEvents([...currentEvents, newEvent]);
      await updateDb(newEvent);

      setEventDetails({
        title: "",
        startTime: "",
        endTime: "",
        description: "",
        date: "",
      });
    }
  };

  const handleEventClick = async (clickInfo) => {
    const { event } = clickInfo;

    if (confirm(`Do you want to edit or delete the event '${event.title}'?`)) {
      if (
        confirm(`Are you sure you want to delete the event '${event.title}'?`)
      ) {
        event.remove();
        await handleDeleteEvent(event);
      } else {
        const newTitle = prompt(
          "Please enter a new title for your event:",
          event.title
        );
        const newTime = prompt(
          "Please enter the new time for your event (HH:MM format):"
        );

        if (newTitle && newTime) {
          event.setProp("title", newTitle);
          event.setStart(`${event.startStr.split("T")[0]}T${newTime}`);
          await handleEditEvent(event, newTitle);
        }
      }
    }
  };

  const handleEvents = async (events) => {
    setCurrentEvents(events);
    const newEvent = events[events.length - 1];
    await updateDb(newEvent);
  };

  const updateDb = async (event) => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/data/save-event`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ events: event }),
      }
    );
    const data = await response.json();

    if (data.success) {
      console.log("Event successfully saved to the database");
    } else {
      console.error("Failed to save event to the database");
    }
  };

  const handleDeleteEvent = async (event) => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/data/delete-event`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ eventId: event.id }),
      }
    );

    const data = await response.json();

    if (data.success) {
      console.log("Event successfully deleted from the database");
    } else {
      console.error("Failed to delete event from the database");
    }
  };

  const handleEditEvent = async (event, newTitle) => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/data/update-event`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ eventId: event.id, title: newTitle }),
      }
    );

    const data = await response.json();

    if (data.success) {
      console.log("Event successfully updated in the database");
    } else {
      console.error("Failed to update event in the database");
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0");
      times.push(`${hour}:00`, `${hour}:30`);
    }
    return times;
  };

  const { title, startTime, endTime, date, description } = eventDetails;
  const timeOptions = generateTimeOptions();
  const formattedSelectedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="demo-app">
      <div className="demo-app-main">
        <label>
          <input
            className="m-2"
            type="checkbox"
            checked={weekendsVisible}
            onChange={handleWeekendsToggle}
          />
          Toggle weekends
        </label>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          events={currentEvents}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventsSet={handleEvents}
        />
        {date && (
          <form
            className="flex flex-col bg-cyan-950 p-10 space-y-4 rounded-2xl"
            style={{
              position: "absolute",
              top: popupPosition.y,
              left: popupPosition.x,
              zIndex: 4,
            }}
            onSubmit={handleEventSave}
          >
            <input
              type="text"
              placeholder="Add title*"
              className="w-full rounded"
              required
              value={title}
              style={{ height: "40px", padding: "10px" }}
              onChange={(e) =>
                setEventDetails({ ...eventDetails, title: e.target.value })
              }
            />
            <div className="flex flex-row gap-2 items-end">
              <p className="text-white">{formattedSelectedDate}</p>
              <select
                value={startTime}
                onChange={(e) =>
                  setEventDetails({
                    ...eventDetails,
                    startTime: e.target.value,
                  })
                }
                className="rounded p-2"
              >
                <option value="">Select start time</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <select
                className="rounded p-2"
                value={endTime}
                onChange={(e) =>
                  setEventDetails({ ...eventDetails, endTime: e.target.value })
                }
              >
                <option value="">Select end time</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              placeholder="Description"
              className="w-full rounded"
              style={{ height: "40px", padding: "10px" }}
              value={description}
              onChange={(e) =>
                setEventDetails({
                  ...eventDetails,
                  description: e.target.value,
                })
              }
            />
            <div className="flex flex-row justify-between gap-5">
              <button type="submit" className="text-white">
                Save Event
              </button>
              <button
                type="button"
                className="text-white"
                onClick={() => setEventDetails({ ...eventDetails, date: "" })}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
