import { motion } from "framer-motion";

const SessionScheduler = () => {
  // Function to generate an array of time options
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };

  // Function to generate an array of date options
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();
    // console.log(today.getDate());
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      options.push(date.toDateString());
    }
    return options;
  };

  return (
    <div className="flex flex-row justify-between">
      <motion.select
        className="date-select w-1/2 rounded-2xl"
        // whileHover={{ scale: 1.1 }}
        // whileTap={{ scale: 0.9 }}
      >
        <option value="" className="">
          Select Date
        </option>
        {generateDateOptions().map((date, index) => (
          <option key={index} value={date}>
            {date}
          </option>
        ))}
      </motion.select>
      <motion.select
        className="time-select w-1/2 p-4 rounded-2xl"
        // whileHover={{ scale: 1.1 }}
        // whileTap={{ scale: 0.9 }}
      >
        <option value="">Select Time</option>
        {generateTimeOptions().map((time, index) => (
          <option key={index} value={time}>
            {time}
          </option>
        ))}
      </motion.select>
    </div>
  );
};

export default SessionScheduler;
