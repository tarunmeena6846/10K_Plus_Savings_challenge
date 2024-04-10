import React, { useState } from "react";
import { motion } from "framer-motion";
import TaskList from "./Tasklist";
import Button from "../Button";
import { response } from "express";
import { error } from "console";
import { validateEmail } from "../validator/emailValidator";
const SWOTdashboard = () => {
  const [strengths, setStrengths] = useState([""]);
  const [weaknesses, setWeaknesses] = useState([""]);
  const [opportunities, setOpportunities] = useState([""]);
  const [threats, setThreats] = useState([""]);
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const handleSubscribeForReminders = () => {
    if (!validateEmail(email)) {
      alert("Invalid email");
      return;
    }
    fetch(`${import.meta.env.VITE_SERVER_URL}/swot/set-reminder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ email: email }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response is not ok");
        }

        response.json().then((data) => {
          if (data.success) {
            alert("Subscribed to weekly reminders");
          } else {
            alert("No tasks added");
          }
        });
      })
      .catch((error) => {
        alert(error);
      });
  };
  const handleStrengthsChange = (index, e) => {
    const newStrengths = [...strengths];
    newStrengths[index] = e.target.value;
    setStrengths(newStrengths);
  };
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleAddStrength = () => {
    setStrengths([...strengths, ""]);
  };

  const handleRemoveStrength = (index) => {
    const newStrengths = [...strengths];
    newStrengths.splice(index, 1);
    setStrengths(newStrengths);
  };

  const handleWeaknessesChange = (index, e) => {
    const newWeaknesses = [...weaknesses];
    newWeaknesses[index] = e.target.value;
    setWeaknesses(newWeaknesses);
  };

  const handleAddWeakness = () => {
    setWeaknesses([...weaknesses, ""]);
  };

  const handleRemoveWeakness = (index) => {
    const newWeaknesses = [...weaknesses];
    newWeaknesses.splice(index, 1);
    setWeaknesses(newWeaknesses);
  };

  const handleOpportunitiesChange = (index, e) => {
    const newOpportunities = [...opportunities];
    newOpportunities[index] = e.target.value;
    setOpportunities(newOpportunities);
  };

  const handleAddOpportunity = () => {
    setOpportunities([...opportunities, ""]);
  };

  const handleRemoveOpportunity = (index) => {
    const newOpportunities = [...opportunities];
    newOpportunities.splice(index, 1);
    setOpportunities(newOpportunities);
  };

  const handleThreatsChange = (index, e) => {
    const newThreats = [...threats];
    newThreats[index] = e.target.value;
    setThreats(newThreats);
  };

  const handleAddThreat = () => {
    setThreats([...threats, ""]);
  };

  const handleRemoveThreat = (index) => {
    const newThreats = [...threats];
    newThreats.splice(index, 1);
    setThreats(newThreats);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can perform any action with the entered SWOT analysis data here
    console.log("Strengths:", strengths);
    console.log("Weaknesses:", weaknesses);
    console.log("Opportunities:", opportunities);
    console.log("Threats:", threats);
  };

  return (
    <div className="container mx-auto mt-8 p-8">
      {/* <TaskList /> */}
      <motion.button
        className="text-red-700 py-2 px-4 rounded fixed top-1/4 transform -translate-y-1/2 right-4 z-50"
        onClick={togglePopup}
      >
        {!showPopup && (
          <div>
            +tasklist
            <img src="./tasklist.svg" />
          </div>
        )}
      </motion.button>

      {showPopup && (
        // <div className="task-list-popup fixed top-0 right-0 bg-white border border-gray-300 rounded shadow-lg p-4">
        //   {/* Task List content */}
        //   {/* Include the task list form and its logic here */}
        // </div>
        <div>
          <TaskList setShowPopup={setShowPopup} />
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">SWOT Analysis</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Strengths:</label>
          {strengths.map((strength, index) => (
            <div key={index} className="flex space-x-2 items-center">
              <textarea
                value={strength}
                onChange={(e) => handleStrengthsChange(index, e)}
                className="w-full border rounded p-2"
              />
              <motion.button
                // type="button"
                onClick={() => handleRemoveStrength(index)}
                className={
                  "login-button rounded-3xl bg-transparent text-black w-50 h-10"
                }
              >
                <img src={"cancel.svg"} alt="Cancel" />
              </motion.button>
            </div>
          ))}
          <motion.button
            // type="button"
            onClick={handleAddStrength}
            className="bg-black text-white px-3 py-1 rounded mt-2 rounded-3xl"
          >
            Add Strength
          </motion.button>
        </div>
        <div>
          <label className="block mb-2">Weaknesses:</label>
          {weaknesses.map((weakness, index) => (
            <div key={index} className="flex space-x-2 items-center">
              <textarea
                value={weakness}
                onChange={(e) => handleWeaknessesChange(index, e)}
                className="w-full border rounded p-2"
              />
              <motion.button
                onClick={() => handleRemoveWeakness(index)}
                className="text-white px-3 py-1 rounded"
              >
                <img src={"cancel.svg"} alt="Cancel" />
              </motion.button>
            </div>
          ))}
          <motion.button
            onClick={handleAddWeakness}
            className="bg-black text-white px-3 py-1 rounded mt-2 rounded-3xl"
          >
            Add Weakness
          </motion.button>
        </div>
        <div>
          <label className="block mb-2">Opportunities:</label>
          {opportunities.map((opportunity, index) => (
            <div key={index} className="flex space-x-2 items-center">
              <textarea
                value={opportunity}
                onChange={(e) => handleOpportunitiesChange(index, e)}
                className="w-full border rounded p-2"
              />
              <motion.button
                onClick={() => handleRemoveOpportunity(index)}
                className=" text-white px-3 py-1 rounded"
              >
                <img src={"cancel.svg"} alt="Cancel" />
              </motion.button>
            </div>
          ))}
          <motion.button
            onClick={handleAddOpportunity}
            className="bg-black text-white px-3 py-1 rounded mt-2 rounded-3xl"
          >
            Add Opportunity
          </motion.button>
        </div>
        <div>
          <label className="block mb-2">Threats:</label>
          {threats.map((threat, index) => (
            <div key={index} className="flex space-x-2 items-center">
              <textarea
                value={threat}
                onChange={(e) => handleThreatsChange(index, e)}
                className="w-full border rounded p-2"
              />
              <motion.button
                onClick={() => handleRemoveThreat(index)}
                className=" text-white px-3 py-1 rounded"
              >
                <img src={"cancel.svg"} alt="Cancel" />
              </motion.button>
            </div>
          ))}
          <motion.button
            onClick={handleAddThreat}
            className="bg-black text-white px-3 py-1 rounded mt-2 rounded-3xl"
          >
            Add Threat
          </motion.button>
        </div>
      </form>
      <div className="pt-10">
        <motion.input
          type="text"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          required
          placeholder="Enter email to subscribe to weekly reminders for completing the tasks"
          className="text-black p-4 rounded-3xl w-3/4"
        />
        <motion.button
          whileHover={{ scale: 1.1 }} // Define hover animation
          whileTap={{ scale: 1 }} // Define hover animation
          className="rounded-3xl bg-black text-white p-4 mr-1 ml-1"
          onClick={handleSubscribeForReminders}
        >
          Subscribe
        </motion.button>
      </div>
    </div>
  );
};

export default SWOTdashboard;
