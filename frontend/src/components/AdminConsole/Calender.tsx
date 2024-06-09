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
  const [eventTime, setEventTime] = useState("");

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible);
  }

  function handleDateSelect(selectInfo) {
    setSelectedDate(selectInfo);
    console.log(selectInfo);
    setPopupPosition({
      x: selectInfo.jsEvent.screenX,
      y: selectInfo.jsEvent.screenY,
    });
    setEventTitle("");
    setEventTime("");
  }

  function handleEventSave() {
    let calendarApi: CalendarApi = FullCalendar.getApi();

    if (eventTitle && eventTime && selectedDate) {
      calendarApi.addEvent({
        id: createEventId(),
        title: eventTitle,
        start: `${selectedDate}T${eventTime}`,
        allDay: false,
      });
      setSelectedDate(null);
      setEventTitle("");
      setEventTime("");
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
          eventsSet={handleEvents} // called after events are initialized/added/changed/removed
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
            className="flex flex-col bg-green-500 p-4 gap-2"
            style={{
              position: "absolute",
              top: popupPosition.y,
              left: popupPosition.x,
              zIndex: 1,
            }}
          >
            {/* <h3>Add Event</h3> */}
            <label className="">
              Event Title:
              <input
                type="text"
                className=""
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </label>
            <label>
              Event Time:
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
              />
            </label>
            <button onClick={handleEventSave}>Save Event</button>
          </div>
        )}
      </div>
    </div>
  );
}
