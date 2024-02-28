import { Card, Modal, Typography } from "@mui/material";
import { useState } from "react";
import {
  SubscriptionData,
  subscriptionState,
  userState,
} from "./store/atoms/user";
import { useRecoilState } from "recoil";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";

function ProjectedDashboard() {
  const [subscription, setSubscripton] =
    useRecoilState<SubscriptionData>(subscriptionState);
  const [videoModalOpen, setVideoModalOpen] = useState(true);
  const [incomeInputVisible, setIncomeInputVisible] = useState(true);
  const [expenseInputVisible, setExpenseInputVisible] = useState(false);
  const [saveVisible, setSaveVisible] = useState(false);
  const [communityVisible, setCommunityVisble] = useState(false);

  const [targetIncome, setTargetIncome] = useState(0);
  const [targetExpense, setTargetExpense] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const navigate = useNavigate();
  const handleVideoModalClose = () => {
    setVideoModalOpen(false);
  };

  const handleIncomeDivClick = () => {
    setIncomeInputVisible(!incomeInputVisible);
    setExpenseInputVisible(false); // Close expense input section
    setSaveVisible(false);
    setCommunityVisble(false);
  };

  const handleExpenseDivClick = () => {
    setExpenseInputVisible(!expenseInputVisible);
    setSaveVisible(!saveVisible);
    setCommunityVisble(false);
    setIncomeInputVisible(false);
  };

  const handleSaveDivClick = () => {
    setExpenseInputVisible(false);
    setSaveVisible(!saveVisible);
    setCommunityVisble(false);
    setIncomeInputVisible(false);
    // setIncomeInputVisible(false); // Close income input section
  };
  const handleCommunityClick = () => {
    setSaveVisible(false);
    setIncomeInputVisible(false); // Close income input section
    setExpenseInputVisible(false);
    setCommunityVisble(!communityVisible);
  };

  const handleSubmitIncome = () => {
    setIncomeInputVisible(false);
    setExpenseInputVisible(true);
  };

  const handleSubmitExpense = () => {
    setExpenseInputVisible(false);
    setSaveVisible(true);
    // Perform other actions if needed
  };

  const handleSaveSubmit = async () => {
    await fetch(
      `${import.meta.env.VITE_SERVER_URL}/data/update-projected-savings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          projectedYearlySavings: targetIncome - targetExpense,
          // year: currentDate.getFullYear(),
          year: new Date().getFullYear(),
        }),
      }
    )
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Network response is not ok");
        }
        resp.json().then((responseData) => {
          console.log("response data at update projeted savings", responseData);

          // setCourses(data);
          if (responseData.success == true) {
            // Clear items array after saving
            // setMonthlyExpense(responseData.totalExpenses);
            navigate("/swotportal");
            // setCurrentUserState({
            //   userEmail: currentUserState.userEmail,
            //   isLoading: false,
            //   imageUrl: currentUserState.imageUrl,
            // });
          } else {
            // setCurrentUserState({
            //   userEmail: null,
            //   isLoading: false,
            //   imageUrl: "",
            // });
            console.error("Error saving projected data:", responseData.error);
          }
        });
      })
      .catch((error) => {
        // setCurrentUserState({
        //   userEmail: null,
        //   isLoading: false,
        //   imageUrl: "",
        // });
        console.error("Error saving projected data");
      });
  };

  // handleSaveSubmit
  // const stopPropagation = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  // };

  return (
    <>
      {videoModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="relative bg-white rounded-lg shadow-lg p-4 w-full max-w-3xl">
            <button
              onClick={handleVideoModalClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/JqYoLQXO7j4"
                title="The importance of saving money"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* <motion.div
        className="projected-input"
        layout
        style={{
          borderRadius: "20px",
          background: "grey",
          margin: "50px",
          cursor: "pointer",
          boxShadow: "0px 10px 30px black",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onClick={handleIncomeDivClick}
        >
          <span style={{ marginRight: "10px" }}>
            Dream big, set your target income, and watch your goals unfold
          </span>
          <button>
            <img
              className="arrow"
              src={incomeInputVisible ? "./up.svg" : "./down.svg"}
              alt="Dropdown arrow"
            />
          </button>
        </div>
        {incomeInputVisible && (
          <div className="flex flex-col md:flex-row">
            <div className="mt-10 md:mt-20 mr-5 flex-grow">
              <span className="mb-2">
                Take the first step towards financial success. Enter your target
                income and pave the way to your dreams
              </span>
              <br />
              {/* <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="mb-2 mt-5 p-2 rounded"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select> 
              <motion.div className="relative">
                <div className="flex items-center">
                  <motion.input
                    type="number"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-2 mt-5 p-2 rounded"
                    onChange={(e) => {
                      // Parse the input value to a number
                      // Check if the parsed value is a valid number
                      setTargetIncome(parseFloat(e.target.value));
                    }}
                  />
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className=" ml-2 mb-2 mt-5 p-2 rounded"
                  >
                    <option value="$">USD ($)</option>
                    <option value="€">EUR (€)</option>
                    <option value="£">GBP (£)</option>
                    {/* Add more currency options as needed 
                  </select>
                </div>
              </motion.div>

              <motion.button
                className="flex grow items-center justify-center rounded-3xl bg-black text-white shadow-lg h-10 w-20 text-center mt-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSubmitIncome}
              >
                Submit
              </motion.button>
            </div>
            <div className="mt-4 md:mt-4">
              <img
                className="rounded-3xl max-w-full h-auto"
                src="./target.png"
                alt="Target"
              />
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        className="projected-input"
        layout
        style={{
          borderRadius: "20px",
          background: "grey",
          margin: "50px",
          cursor: "pointer",
          boxShadow: "0px 10px 30px black",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onClick={handleExpenseDivClick}
        >
          <span style={{ marginRight: "10px" }}>
            Set your target expenses wisely, they pave the way for your
            financial stability.
          </span>
          <button>
            <img
              className="arrow"
              src={expenseInputVisible ? "./up.svg" : "./down.svg"}
              alt="Dropdown arrow"
            />
          </button>
        </div>
        {expenseInputVisible && (
          <div className="flex flex-col md:flex-row">
            <div className="mt-10 md:mt-20 mr-5 flex-grow">
              <span className="mb-2">
                Take control of your finances and set your target expenses
                wisely. Each expense decision you make today shapes your
                financial future tomorrow.
              </span>
              <br />
              <motion.div className="relative">
                <div className="flex items-center">
                  <motion.input
                    type="number"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-2 mt-5 p-2 rounded"
                    onChange={(e) => {
                      // Parse the input value to a number
                      // Check if the parsed value is a valid number
                      setTargetExpense(parseFloat(e.target.value));
                    }}
                  />
                  <select
                    value={selectedCurrency}
                    // onChange={(e) => setSelectedCurrency(e.target.value)}
                    className=" ml-2 mb-2 mt-5 p-2 rounded"
                  >
                    <option value="$">USD ($)</option>
                    <option value="€">EUR (€)</option>
                    <option value="£">GBP (£)</option>
                    {/* Add more currency options as needed 
                  </select>
                </div>
              </motion.div>

              <motion.button
                className="flex grow items-center justify-center rounded-3xl bg-black text-white shadow-lg h-10 w-20 text-center mt-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSubmitExpense}
              >
                Submit
              </motion.button>
            </div>
            <div className="mt-4 md:mt-4">
              <img
                className="rounded-3xl max-w-full h-auto"
                src="./target.jpg"
                alt="Target"
              />
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        className="projected-input"
        layout
        style={{
          borderRadius: "20px",
          background: "grey",
          margin: "50px",
          cursor: "pointer",
          boxShadow: "0px 10px 30px black",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onClick={handleSaveDivClick}
        >
          <span style={{ marginRight: "10px" }}>
            Unlock financial freedom effortlessly with savings calculated based
            on your income and expenses.
          </span>
          <button>
            <img
              className="arrow"
              src={saveVisible ? "./up.svg" : "./down.svg"}
              alt="Dropdown arrow"
            />
          </button>
        </div>
        {saveVisible && (
          <div className="flex flex-col md:flex-row">
            <div className="mt-10 md:mt-20 mr-5 flex-grow">
              <span className="mb-2">
                Secure your financial future by setting ambitious savings goals.
                Every dollar you save today is a step closer to the life you
                envision for tomorrow.
              </span>
              <br />
              <p className="feature-title py-16 font-heading text-5xl transition-colors text-black">
                Projected Savings: {targetIncome - targetExpense}
                {selectedCurrency}
              </p>
              <motion.button
                className="flex grow items-center justify-center rounded-3xl bg-black text-white shadow-lg h-10 w-20 text-center mt-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSaveSubmit}
              >
                Continue
              </motion.button>
            </div>
            <div className="mt-4 md:mt-4">
              <img
                className="rounded-3xl max-w-full h-auto"
                src="./goal.jpg"
                alt="Target"
              />
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        className="projected-input"
        layout
        style={{
          borderRadius: "20px",
          background: "grey",
          margin: "50px",
          cursor: "pointer",
          boxShadow: "0px 10px 30px black",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onClick={handleCommunityClick}
        >
          <span style={{ marginRight: "10px" }}>
            Create your Community Profile.
          </span>
          <button>
            <img
              className="arrow"
              src={communityVisible ? "./up.svg" : "./down.svg"}
              alt="Dropdown arrow"
            />
          </button>
        </div>
        {communityVisible && (
          <div className="flex flex-col md:flex-row">
            <div className="mt-10 md:mt-20 mr-5 flex-grow">
              <span className="mb-2">
                Secure your financial future by setting ambitious savings goals.
                Every dollar you save today is a step closer to the life you
                envision for tomorrow.
              </span>
              <br />
             
              <div className="flex mt-4">
                <motion.input
                  className="rounded"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial="Claim username"
                ></motion.input>

                <motion.button
                  className="flex items-center justify-center rounded-3xl bg-black text-white shadow-lg h-10 text-center ml-5 p-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    navigate("/community");
                  }}
                >
                  Choose username
                </motion.button>
              </div>
            </div>
            <div className="mt-4 md:mt-4">
              <img
                className="rounded-3xl max-w-full h-auto"
                src="./goal.jpg"
                alt="Target"
              />
            </div>
          </div>
        )}
      </motion.div> */}
    </>
  );
}

export default ProjectedDashboard;

// import React, { useState } from "react";
// import InputSection from "./InputSection";

// interface ProjectedDashboardProps {}

// const ProjectedDashboard: React.FC<ProjectedDashboardProps> = () => {
//   const [incomeInputVisible, setIncomeInputVisible] = useState(false);
//   const [expenseInputVisible, setExpenseInputVisible] = useState(false);
//   const [saveVisible, setSaveVisible] = useState(false);
//   const [videoModalOpen, setVideoModalOpen] = useState(false);

//   const handleIncomeToggle = () => {
//     setIncomeInputVisible(!incomeInputVisible);
//     setExpenseInputVisible(false);
//     setSaveVisible(false);
//   };

//   const handleExpenseToggle = () => {
//     setExpenseInputVisible(!expenseInputVisible);
//     setIncomeInputVisible(false);
//     setSaveVisible(false);
//   };

//   const handleSaveToggle = () => {
//     setSaveVisible(!saveVisible);
//     setIncomeInputVisible(false);
//     setExpenseInputVisible(false);
//   };

//   const handleSubmitIncome = () => {
//     setIncomeInputVisible(false);
//     setExpenseInputVisible(true);
//   };

//   const handleSubmitExpense = () => {
//     setExpenseInputVisible(false);
//     setSaveVisible(true);
//   };

//   const handleSubmitSave = () => {
//     // Handle save submission
//   };

//   const handleVideoModalClose = () => {
//     setVideoModalOpen(false);
//   };

//   return (
//     <>
//       {videoModalOpen && (
//         <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-75">
//           <div className="relative bg-white rounded-lg shadow-lg p-4 w-full max-w-3xl">
//             <button
//               onClick={handleVideoModalClose}
//               className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
//             >
//               Close
//             </button>
//             <div className="aspect-w-16 aspect-h-9">
//               <iframe
//                 className="w-full h-full"
//                 src="https://www.youtube.com/embed/JqYoLQXO7j4"
//                 title="The importance of saving money"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//               ></iframe>
//             </div>
//           </div>
//         </div>
//       )}

//       <InputSection
//         title="Dream big, set your target income, and watch your goals unfold"
//         isOpen={incomeInputVisible}
//         onToggle={handleIncomeToggle}
//         onSubmit={handleSubmitIncome}
//         imageSrc="./target.png"
//       />
//       <InputSection
//         title="Set your target expenses wisely, they pave the way for your financial stability."
//         isOpen={expenseInputVisible}
//         onToggle={handleExpenseToggle}
//         onSubmit={handleSubmitExpense}
//         imageSrc="./target.jpg"
//       />
//       <InputSection
//         title="Embark on your journey towards financial prosperity."
//         isOpen={saveVisible}
//         onToggle={handleSaveToggle}
//         onSubmit={handleSubmitSave}
//         imageSrc="./target.jpg"
//       />
//     </>
//   );
// };

// export default ProjectedDashboard;
