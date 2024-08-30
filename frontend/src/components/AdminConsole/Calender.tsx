import React, { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useRecoilState } from "recoil";
import { currentEventsState } from "../store/atoms/events";
import DrawerForm from "./DrawerForm";

function extractDateTime(dateTimeString: any) {
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
  const [currentEvents, setCurrentEvents] = useRecoilState(currentEventsState);
  // const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const [eventDetails, setEventDetails] = useState({
    _id: "",
    title: "",
    startTime: "",
    endTime: "",
    description: "",
    date: "",
  });
  // const [isEditing, setIsEditing] = useState(false);

  // function addDaysToDate(dateString: any, daysToAdd: any) {
  //   // Parse the input date string
  //   const date = new Date(dateString);

  //   // Add the specified number of days
  //   date.setDate(date.getDate() + daysToAdd);

  //   // Format the date back to 'YYYY-MM-DD'
  //   const year = date.getFullYear();
  //   const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so we add 1

  //   return { year, month };
  // }
  // useEffect(() => {
  // Fetch events from the database when the component mounts
  const fetchEventsForMonth = async (dateInfo: any) => {
    console.log(dateInfo.startStr, dateInfo.endStr);
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

  const handleDateSelect = (selectInfo: any) => {
    console.log("heher");
    setDrawerVisible(true);
    setDeletePopup(false);
    const { clientX: x, clientY: y } = selectInfo.jsEvent;
    const { startTime, endTime, selectedDate } = extractDateTime(selectInfo);

    console.log(startTime, endTime);
    setEventDetails({
      _id: "",
      title: "",
      startTime,
      endTime,
      description: "",
      date: selectedDate,
    });

    // setPopupPosition({
    //   x: x + 500 > window.innerWidth ? window.innerWidth - 500 : x,
    //   y: y + 300 > window.innerHeight ? window.innerHeight - 300 : y,
    // });

    // setIsEditing(false);
  };

  const handleEventClick = (clickInfo) => {
    const { clientX: x, clientY: y } = clickInfo.jsEvent;
    setDrawerVisible(true);

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

    // setPopupPosition({
    //   x: x + 500 > window.innerWidth ? window.innerWidth - 500 : x,
    //   y: y + 400 > window.innerHeight ? window.innerHeight - 400 : y,
    // });

    // setIsEditing(true);
  };

  const handleEventSave = async (e) => {
    e.preventDefault();
    const { _id, title, startTime, endTime, date, description } = eventDetails;

    if (title && startTime && endTime) {
      const newEvent = {
        _id: `temp-${Date.now()}`, // Use a temporary ID for new events
        title,
        start: `${date}T${startTime}:00`,
        end: `${date}T${endTime}:00`,
        description,
      };

      console.log("New Event:", newEvent);

      // Add new event
      setCurrentEvents([...currentEvents, newEvent]);

      // Attempt to save in the database
      try {
        const savedEvent = await saveToDb(newEvent);
        console.log(savedEvent);
        if (savedEvent) {
          console.log(currentEvents);

          setDrawerVisible(false);
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
        setDrawerVisible(false);
      } else {
        setCurrentEvents(eventBeforeDelete);
        // setDrawerVisible(false)
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

  // const { title, startTime, endTime, date, description } = eventDetails;
  // const timeOptions = generateTimeOptions();
  // const endTimeOptions = generateEndTimeOptions(startTime);

  // const formattedSelectedDate = date
  //   ? new Date(date).toLocaleDateString("en-US", {
  //       year: "numeric",
  //       month: "long",
  //       day: "numeric",
  //     })
  //   : "";
  // console.log(currentEvents);
  return (
    <div className="demo-app text-white">
      <style>
        {`
          .fc-more-popover {
            background-color: #f0f0f0;
            color: #333;
          }
          .fc-popover-close {
            // display: inline-flex;
            // align-items: center;
            // justify-content: center;
            // width: 24px; /* Adjust size as needed */
            // height: 24px; /* Adjust size as needed */
            background-image: url('/cancel.svg'); /* Path to your SVG file */
            background-size: contain;
            background-repeat: no-repeat;
            background-color: gray; /* Remove background if needed */
            // border: none;
            cursor: pointer;
          }
          .fc-icon-chevron-right {
            // display: inline-flex;
            // align-items: center;
            // justify-content: center;
            // width: 24px; /* Adjust size as needed */
            // height: 24px; /* Adjust size as needed */
            background-image: url('/right-arrow.svg'); /* Path to your SVG file */
            background-size: contain;
            background-repeat: no-repeat;
            background-color: white; /* Remove background if needed */
            // border: none;
            cursor: pointer;
          }

          .fc-icon-chevron-left {
            // display: inline-flex;
            // align-items: center;
            // justify-content: center;
            // width: 24px; /* Adjust size as needed */
            // height: 24px; /* Adjust size as needed */
            background-image: url('/left-arrow.svg'); /* Path to your SVG file */
            background-size: contain;
            background-repeat: no-repeat;
            background-color: white; /* Remove background if needed */
            // border: none;
            // padding: 15px;
            // border-radius: 0px
            // border-color:black
            cursor: pointer;
          }
        `}
      </style>
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
            start: "prev,next",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
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
        <DrawerForm
          drawerVisible={drawerVisible}
          setDrawerVisible={setDrawerVisible}
          setEventDetails={setEventDetails}
          eventDetails={eventDetails}
          handleSave={handleEventSave}
          handleDeleteEvent={handleDeleteEvent}
          deletePopup={deletePopup}
          setDeletePopup={setDeletePopup}
        />
      </div>
    </div>
  );
}
