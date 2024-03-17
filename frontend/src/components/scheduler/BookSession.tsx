import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import UserTimeZone from "./TimeZone";
import SessionScheduler from "./SessionScheduler";
import { useRecoilValue } from "recoil";
import { userState } from "../store/atoms/user";
import moment from "moment-timezone"; // Import moment-timezone library

const BookSession = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [time, setTime] = useState(new Date().getTime());
  const [date, setDate] = useState(Date);

  // const { user } = useParams();
  const currentUserState = useRecoilValue(userState);
  //👇🏻 logs the user's details to the console
  console.log(currentUserState);

  const handleSubmit = (e) => {
    //
    e.preventDefault();
    // const selectedDateTime = moment
    //   .tz(`${date} ${time}`, "UTC")
    //   .tz("America/New_York");

    
    console.log(email, fullName, message, time, date);
    setFullName("");
    setMessage("");
  };

  return (
    <div className="flex flex-col justify-center items-center mx-auto max-w-7xl p-10">
      <h2 className="bookTitle text-3xl">Schedule your session</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center w-3/4"
      >
        <label className="pt-2 pl-2" htmlFor="fullName">
          Full Name
        </label>
        <motion.input
          type="text"
          // required
          value={fullName}
          className="mb-4 rounded-2xl p-4"
          onChange={(e) => setFullName(e.target.value)}
        />
        <label className="pl-2" htmlFor="email">
          Email Address
        </label>
        <motion.input
          id="email"
          name="email"
          // required
          type="email"
          value={email}
          className="mb-4 rounded-2xl p-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="pl-2" htmlFor="message">
          Any important note? (optional)
        </label>
        <textarea
          rows={5}
          name="message"
          id="message"
          value={message}
          className="mb-4 rounded-2xl p-4"
          onChange={(e) => setMessage(e.target.value)}
        />

        <label htmlFor="session" className="pl-2">
          Select your preferred time
        </label>
        <UserTimeZone></UserTimeZone>
        <SessionScheduler setTime={setTime} setDate={setDate} />

        <motion.button
          className="bookingBtn rounded-3xl p-3 bg-black text-white mt-5 "
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Book
        </motion.button>
      </form>
    </div>
  );
};

export default BookSession;
