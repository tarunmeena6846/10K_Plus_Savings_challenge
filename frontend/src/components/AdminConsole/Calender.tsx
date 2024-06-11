import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { createEventId } from "./event-utils";
import { CalendarApi } from "@fullcalendar/core";

export default function DemoApp() {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const [eventTitle, setEventTitle] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [description, setDescription] = useState("");

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible);
  }

  function handleDateSelect(selectInfo) {
    console.log(selectInfo);
    const { clientX: x, clientY: y } = selectInfo.jsEvent;
    const popupWidth = 200; // approximate width of the popup
    const popupHeight = 150; // approximate height of the popup
    const buffer = 300; // buffer space between popup and screen edges

    const adjustedX =
      x + popupWidth + buffer > window.innerWidth
        ? window.innerWidth - popupWidth - buffer
        : x;
    const adjustedY =
      y + popupHeight + buffer > window.innerHeight
        ? window.innerHeight - popupHeight - buffer
        : y;

    setSelectedDate(selectInfo.startStr);
    setPopupPosition({ x: adjustedX, y: adjustedY });
    setEventTitle("");
    setEventEndTime("");
    setEventStartTime("");
    setDescription("");
  }

  function handleEventSave() {
    let calendarApi: CalendarApi = FullCalendar.getApi();

    if (eventTitle && eventStartTime && selectedDate) {
      calendarApi.addEvent({
        id: createEventId(),
        title: eventTitle,
        start: `${selectedDate}T${eventStartTime}`,
        allDay: false,
      });
      setSelectedDate(null);
      setEventTitle("");
      setEventEndTime("");
      setEventStartTime("");
      setDescription("");
    }
  }

  function handleEventClick(clickInfo) {
    if (
      confirm(
        `Do you want to edit or delete the event '${clickInfo.event.title}'?`
      )
    ) {
      if (
        confirm(
          `Are you sure you want to delete the event '${clickInfo.event.title}'?`
        )
      ) {
        clickInfo.event.remove();
        handleDeleteEvent(clickInfo.event);
      } else {
        let newTitle = prompt(
          "Please enter a new title for your event:",
          clickInfo.event.title
        );
        let newTime = prompt(
          "Please enter the new time for your event (HH:MM format):"
        );
        if (newTitle && newTime) {
          clickInfo.event.setProp("title", newTitle);
          clickInfo.event.setStart(
            `${clickInfo.event.startStr.split("T")[0]}T${newTime}`
          );
          handleEditEvent(clickInfo.event, newTitle);
        }
      }
    }
  }

  async function handleEvents(events) {
    setCurrentEvents(events);
    const newEvent = events[events.length - 1];
    try {
      await updateDb(newEvent);
    } catch (error) {
      alert("Error creating event");
    }
  }

  async function updateDb(event) {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/data/save-event`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("token"),
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
  }

  async function handleDeleteEvent(event) {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/data/delete-event`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("token"),
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
  }

  async function handleEditEvent(event, newTitle) {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/data/update-event`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("token"),
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
  }

  const formattedSelectedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  console.log(formattedSelectedDate);
  const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0");
      times.push(`${hour}:00`, `${hour}:30`);
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

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
          toggle weekends
        </label>
        <FullCalendar
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
          initialEvents={currentEvents} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventsSet={() => {
            handleEvents;
          }} // called after events are initialized/added/changed/removed
          eventAdd={function () {
            console.log("add called");
          }}
          eventChange={function () {
            console.log("event changed called");
          }}
          eventRemove={function () {
            console.log("event remove called");
          }}
        />

        {selectedDate && (
          <div
            className="flex flex-col bg-cyan-950 p-10 space-y-4 rounded-2xl"
            style={{
              position: "absolute",
              top: popupPosition.y,
              left: popupPosition.x,
              zIndex: 4, // For week interface overlapping problem
            }}
          >
            {/* <h3>Add Event</h3> */}

            <input
              type="text"
              placeholder="Add Title"
              className="w-full rounded"
              // style={{ color: "white" }}
              value={eventTitle}
              style={{ height: "40px", padding: "10px" }}
              onChange={(e) => setEventTitle(e.target.value)}
            />

            <div className="flex flex-row gap-2 items-end">
              <p className="text-white">{formattedSelectedDate}</p>
              <select
                value={eventStartTime}
                onChange={(e) => setEventStartTime(e.target.value)}
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
                className=" rounded p-2"
                value={eventEndTime}
                onChange={(e) => setEventEndTime(e.target.value)}
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
              // style={{ color: "white" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex flex-row justify-between gap-5">
              <button className="text-white" onClick={handleEventSave}>
                Save Event
              </button>
              <button
                className="text-white"
                onClick={() => {
                  setSelectedDate(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
