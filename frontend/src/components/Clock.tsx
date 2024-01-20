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
    <div>
      <Typography variant="h4" gutterBottom>
        {formatTime(currentDateTime)}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {formatDate(currentDateTime)}
      </Typography>
    </div>
  );
};

export default Clock;
