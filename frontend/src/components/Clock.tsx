import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";

const Clock = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      //   second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4 flex justify-between">
      <h2 className="text-3xl mr-2">{formatTime(currentDateTime)}</h2>
      <h2 className="text-3xl">{formatDate(currentDateTime)}</h2>
    </div>
  );
};

export default Clock;
