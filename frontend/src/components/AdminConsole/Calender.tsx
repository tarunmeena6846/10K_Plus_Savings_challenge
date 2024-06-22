import React, { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

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
    _id: "",
    title: "",
    startTime: "",
    endTime: "",
    description: "",
    date: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  function addDaysToDate(dateString, daysToAdd) {
    // Parse the input date string
    const date = new Date(dateString);

    // Add the specified number of days
    date.setDate(date.getDate() + daysToAdd);

    // Format the date back to 'YYYY-MM-DD'
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so we add 1

    return { year, month };
  }
  // useEffect(() => {
  // Fetch events from the database when the component mounts
  const fetchEventsForMonth = async (dateInfo) => {
    // const { startTime, endTime, selectedDate } = extractDateTime(dateInfo);

    // console.log(startTime, endTime, selectedDate);
    // const { year, month } = addDaysToDate(selectedDate, 15);

    // console.log(year, month); // Output: '2024-06-10'
    console.log(dateInfo, typeof dateInfo.startStr);
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/event/get-events?startTime=${
        dateInfo.startStr
      }&endTime=${dateInfo.endStr}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();
    if (data.success) {
      console.log(data.events);
      setCurrentEvents(data.events);
    } else {
      console.error("Failed to fetch events from the database");
    }
  };

  // fetchEvents();
  // }, []);

  const handleWeekendsToggle = () => setWeekendsVisible(!weekendsVisible);

  const handleDateSelect = (selectInfo) => {
    const { clientX: x, clientY: y } = selectInfo.jsEvent;
    const { startTime, endTime, selectedDate } = extractDateTime(selectInfo);

    setEventDetails({
      _id: "",
      title: "",
      startTime,
      endTime,
      description: "",
      date: selectedDate,
    });

    setPopupPosition({
      x: x + 500 > window.innerWidth ? window.innerWidth - 500 : x,
      y: y + 300 > window.innerHeight ? window.innerHeight - 300 : y,
    });

    setIsEditing(false);
  };

  const handleEventClick = (clickInfo) => {
    const { clientX: x, clientY: y } = clickInfo.jsEvent;

    const {
      title,
      startStr,
      endStr,
      extendedProps: { description = "", _id },
    } = clickInfo.event;
    const { startTime, endTime, selectedDate } = extractDateTime({
      startStr,
      endStr,
    });
    console.log(clickInfo);
    console.log(_id, title, startTime, endTime, description);
    setEventDetails({
      _id,
      title,
      startTime,
      endTime,
      description,
      date: selectedDate,
    });

    setPopupPosition({
      x: x + 500 > window.innerWidth ? window.innerWidth - 500 : x,
      y: y + 400 > window.innerHeight ? window.innerHeight - 400 : y,
    });

    setIsEditing(true);
  };

  const handleEventSave = async (e) => {
    e.preventDefault();
    const { _id, title, startTime, endTime, date, description } = eventDetails;

    if (title && startTime && endTime) {
      const newEvent = {
        _id: isEditing ? _id : `temp-${Date.now()}`, // Use a temporary ID for new events
        title,
        start: `${date}T${startTime}:00`,
        end: `${date}T${endTime}:00`,
        description,
      };

      console.log("New Event:", newEvent);

      if (isEditing) {
        console.log(currentEvents);
        const originalEventBeforeUpdate = [...currentEvents];
        // Update existing event
        const updatedEvents = currentEvents.map((event) =>
          event._id === _id ? newEvent : event
        );
        console.log(updatedEvents);
        setCurrentEvents(updatedEvents);

        // Attempt to update in the database
        try {
          const success = await updateDb(newEvent);

          if (!success) {
            console.log("in nonsucces");
            // // Revert to previous state on failure
            setCurrentEvents(originalEventBeforeUpdate);
          }
        } catch (error) {
          console.log("in catch block");
          alert("Error updating event");
          setCurrentEvents(originalEventBeforeUpdate);

          // Handle error appropriately (e.g., revert state)
        }
      } else {
        // Add new event
        setCurrentEvents([...currentEvents, newEvent]);

        // Attempt to save in the database
        try {
          const savedEvent = await saveToDb(newEvent);
          console.log(savedEvent);
          if (savedEvent) {
            console.log(currentEvents);
            // Update currentEvents with savedEvent from database

            // setCurrentEvents((prevEvents) =>
            //   prevEvents.map((event) =>
            //     event._id === newEvent._id ? savedEvent : event
            //   )
            // );

            setCurrentEvents((prevEvents) => {
              console.log(prevEvents);
              const updatedEvents = prevEvents.map((event) =>
                event._id === newEvent._id
                  ? { ...event, _id: savedEvent._id }
                  : event
              ); // Perform actions based on updatedEvents
              console.log(updatedEvents, newEvent);

              return updatedEvents; // Return the updated state
            });
          } else {
            console.log("Failed to save event to database");
            // Remove temporary event if save fails
            setCurrentEvents((prevEvents) =>
              prevEvents.filter((event) => event._id !== newEvent._id)
            );
          }
        } catch (error) {
          console.log("Error saving event:", error);
          // Handle error appropriately (e.g., remove temporary event)
          setCurrentEvents((prevEvents) =>
            prevEvents.filter((event) => event._id !== newEvent._id)
          );
        }
      }

      // Reset eventDetails state
      setEventDetails({
        _id: "",
        title: "",
        startTime: "",
        endTime: "",
        description: "",
        date: "",
      });
    }
  };

  // const handleEventSave = async (e) => {
  //   e.preventDefault();
  //   const { _id, title, startTime, endTime, date, description } = eventDetails;
  //   if (title && startTime && endTime) {
  //     const newEvent = {
  //       _id: isEditing ? _id : `temp-${Date.now()}`, // Use a temporary ID for new events
  //       title,
  //       start: `${date}T${startTime}:00`,
  //       end: `${date}T${endTime}:00`,
  //       description,
  //     };
  //     console.log(newEvent);
  //     if (isEditing) {
  //       // Update in-memory state immediately
  //       const updatedEvents = currentEvents.map((event) =>
  //         event._id === _id ? newEvent : event
  //       );
  //       setCurrentEvents(updatedEvents);
  //       // Attempt to update in the database
  //       const success = await updateDb(newEvent);
  //       if (!success) {
  //         // Revert in-memory state if update fails
  //         setCurrentEvents((prevEvents) =>
  //           prevEvents.map((event) =>
  //             event._id === _id ? { ...event, ...eventDetails } : event
  //           )
  //         );
  //       }
  //     } else {
  //       // Add to in-memory state immediately
  //       console.log(currentEvents, newEvent);
  //       setCurrentEvents([...currentEvents, newEvent]);
  //       // Attempt to save in the database
  //       const savedEvent = await saveToDb(newEvent);
  //       console.log(savedEvent, currentEvents);
  //       if (savedEvent) {
  //         // // Replace temporary ID with actual ID from the database
  //         setCurrentEvents((prevEvents) =>
  //           prevEvents.map((event) =>
  //             event._id === newEvent._id ? savedEvent : event
  //           )
  //         );

  //         console.log(currentEvents);
  //       } else {
  //         console.log("inside else part");
  //         // Remove the temporary event if save fails
  //         setCurrentEvents((prevEvents) =>
  //           prevEvents.filter((event) => event._id !== newEvent._id)
  //         );
  //       }
  //     }

  //     setEventDetails({
  //       _id: "",
  //       title: "",
  //       startTime: "",
  //       endTime: "",
  //       description: "",
  //       date: "",
  //     });
  //   }
  // };

  const handleDeleteEvent = async () => {
    const { _id } = eventDetails;
    const eventBeforeDelete = [...currentEvents];
    console.log(_id, eventBeforeDelete);

    try {
      const newEventList = currentEvents.filter((event) => event._id !== _id);
      console.log(newEventList);
      setCurrentEvents(newEventList);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/event/delete-event`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ eventId: _id }),
        }
      );
      const data = await response.json();

      if (data.success) {
        console.log("Event successfully deleted from the database");
      } else {
        setCurrentEvents(eventBeforeDelete);
        alert("Failed to delete event from the database");
      }
    } catch (error) {
      console.log("Error deleting the event from the db");
      setCurrentEvents(eventBeforeDelete);
    }

    // Reset eventDetails state
    setEventDetails({
      _id: "",
      title: "",
      startTime: "",
      endTime: "",
      description: "",
      date: "",
    });
  };

  const saveToDb = async (event) => {
    console.log(event);
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/event/save-event`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ event }),
      }
    );
    const data = await response.json();

    if (data.success) {
      console.log("Event successfully saved to the database");
      console.log(data.event);
      return data.event; // Return the saved event with _id
    } else {
      console.error("Failed to save event to the database");
      return null;
    }
  };

  const updateDb = async (event) => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/event/update-event`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ event }),
      }
    );

    const data = await response.json();

    if (data.success) {
      console.log("Event successfully updated in the database");
      return data.data;
    } else {
      console.error("Failed to update event in the database");
      return null;
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
  console.log(currentEvents);
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
          // eventsSet={setCurrentEvents} // Sync with currentEvents state
          datesSet={(dateInfo) => {
            console.log(dateInfo);
            fetchEventsForMonth(dateInfo);
          }}
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
            <div className="flex gap-1">
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded grow"
              >
                {isEditing ? "Update Event" : "Add Event"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="bg-red-500 text-white p-2 rounded grow"
                  onClick={handleDeleteEvent}
                >
                  Delete Event
                </button>
              )}
            </div>
            <button
              className="bg-red-500 text-white p-2 rounded"
              onClick={() => setEventDetails({ ...eventDetails, date: "" })}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
