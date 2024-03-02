import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const BookSession = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useParams();

  //👇🏻 logs the user's details to the console
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, fullName, message);
    setFullName("");
    setMessage("");
  };

  return (
    <div className="flex flex-col justify-center items-center mx-auto max-w-7xl p-10">
      <h2 className="bookTitle">Book a session with {user}</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center w-3/4"
      >
        <label className="pb-2" htmlFor="fullName">
          Full Name
        </label>
        <motion.input
          type="text"
          required
          // value={fullName}
          className="mb-4 rounded-2xl p-4"
          onChange={(e) => setFullName(e.target.value)}
        />
        <label htmlFor="email">Email Address</label>
        <motion.input
          id="email"
          name="email"
          required
          type="email"
          value={email}
          className="mb-4 rounded-2xl p-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="message">Any important note? (optional)</label>
        <textarea
          rows={5}
          name="message"
          id="message"
          value={message}
          className="mb-4 rounded-2xl p-4"
          onChange={(e) => setMessage(e.target.value)}
        />

        <label htmlFor="session" className="mb-4">
          Select your preferred session - GMT+2 Jerusalem
        </label>
        <motion.input
          id="email"
          name="email"
          required
          type="email"
          value={email}
          className="mb-4 rounded-2xl p-4"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bookingBtn">SEND</button>
      </form>
    </div>
  );
};

export default BookSession;
