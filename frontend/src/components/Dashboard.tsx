import React, { useEffect, useState, useRef } from "react";
import { Modal, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { monthlyExpenseState, monthlyIncomeState } from "./store/atoms/total";
import MonthlyChart from "./MonthlyChart";
import MonthlyBarGraph from "./MonthlyBarGraph";
import { userState, videoModalState } from "./store/atoms/user";
import UserAvatar from "./UserAvatar"; // Adjust the path based on your project structure
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { months, years } from "./MonthlyIncome";
import { dateState } from "./store/atoms/date";
import Clock from "./Clock";
import SettingsIcon from "@mui/icons-material/Settings";
import redirectToStripeCheckout from "../stripe/StripeCheckout";
import VideoModal from "./VideoModels/VideoModal";
import SecondModal from "./VideoModels/SecondModel";
import { motion } from "framer-motion";
import CustomeButton from "./Button";
import SideBar from "./Sidebar/SideBar";
import SidebarLayout from "./SidebarLayout";
import { fetchData } from "./Dashboard/fetchIncomeAndExpenseData";
import Loader from "./community/Loader";
import DoughnutData from "./DoughnutChart";
import MonthwiseDataGraph from "./LineGraph";
import LineChart from "./SavingsLineGraph";
import SavingsTrendPrediction from "./SavingsPrediction";

export const monthIncExpInfo = [
  { name: "Rent", amount: 1000, type: "expense" },
  { name: "Car Insurance", amount: 200, type: "expense" },
  { name: "Internet", amount: 100, type: "expense" },
  { name: "Job", amount: 3000, type: "income" },
  { name: "Freelencing", amount: 1000, type: "income" },
  { name: "Side Hustle", amount: 300, type: "income" },
  { name: "Guitar Lessons", amount: 300, type: "income" },
];
export interface MonthlyDataItem {
  month: string;
  actualSavings: number;
  projectedSaving: number; // Replace 'any' with the actual type
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [videoModalOpen, setVideoModalOpen] = useRecoilState(videoModalState);
  console.log(videoModalOpen);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [myWhyModalOpen, setWhyModalOpen] = useState(false);
  const [myWhyData, setMyWhyData] = useState("");
  const [monthlyData, setMonthlyData] = useState<MonthlyDataItem[]>([]);
  const [isMonthlyDataReady, setIsMonthlyDataReady] = useState(false);
  // const [monthIncExpInfo, setMonthIncExpInfo] = useState([]); // holds the monthly income and expense info along with the items
  const [annualActualSavings, setAnnualActualSavings] = useState(0);
  const [annualTargetSavings, setAnnualTargetSavings] = useState(0);
  const [annualCurrentSavings, setAnnualCurrentSavings] = useState(0);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);

  useEffect(() => {
    const fetchDataAsync = async () => {
      setCurrentUserState((prev) => ({ ...prev, isLoading: true }));
      const savingsData = await fetchData(
        new Date().getFullYear(),
        new Date().toLocaleString("default", { month: "long" }),
        "savingsdashboard"
      );
      console.log(savingsData);
      if (savingsData.success === true) {
        setAnnualActualSavings(savingsData.annualActualSavings);
        setAnnualTargetSavings(savingsData.annualTargetSavings);
        setAnnualCurrentSavings(savingsData.annualCurrentSavings);
        setMonthlyData(savingsData.monthWiseData);
        setIsMonthlyDataReady(true);
      }
      setCurrentUserState((prev) => ({ ...prev, isLoading: false }));
    };
    fetchDataAsync();
  }, []); // Run this effect only once when the component mounts
  console.log(monthlyData);
  // useEffect(() => {
  //   // Check if the necessary data is available before navigating
  //   if (currentUserState.userEmail && !currentUserState.isLoading) {
  //     navigate("/dashboard");
  //   }
  // }, [
  //   currentUserState.userEmail,
  //   currentUserState.isLoading,
  //   navigate,
  //   setCurrentUserState,
  // ]);

  const handleVideoModalClose = () => {
    setVideoModalOpen({ dashboardVideoModal: false });
    setShowSecondModal(true); // Show the second modal when the first modal is closed
  };
  const handleDisablePopup = async () => {
    console.log("at disable popup");
    const response = await fetch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/notification/disabledashboardVideoPopup`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response is not ok");
    }

    const data = await response.json();
    console.log(data);
    if (data.success) {
      setVideoModalOpen({ dashboardVideoModal: false });
      setShowSecondModal(false);
      alert("Popup disabled");
    } else {
      alert("Error while disabling");
    }
  };

  /*
  const handleSaveMyWhy = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/set-my-why-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            data: currentUserState.myWhy,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response is not ok");
      }

      await response.json().then((data) => {
        console.log("data", data);
        if (data.success) {
          setWhyModalOpen(false);
        }
      });
    } catch (error) {
      console.error("Error while saving the myWhy data", error);
    }
  };

  const handleBuyClick = async () => {
    // Handle Buy button click
    console.log("before checkout");
    await redirectToStripeCheckout(
      "price_1OjffbSBiPFrlsnb4MjS068p",
      "payment",
      currentUserState.userEmail
    );
  };
  */
  useEffect(() => {
    // Check if the necessary data is available before navigating
    if (currentUserState.userEmail === null && !currentUserState.isLoading) {
      navigate("/login");
    }
  }, [
    currentUserState.userEmail,
    currentUserState.isLoading,
    navigate,
    setCurrentUserState,
  ]);
  const currentHour = new Date().getHours();

  // Determine the appropriate greeting based on the time of day
  let greeting = "Good Morning";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good Afternoon";
  } else if (currentHour >= 18 || currentHour < 5) {
    greeting = "Good Evening";
  }
  return (
    // <div className=" h-full md:h-screen bg-[#111f36] md:bg-[#eaeaea] p-2  md:p-0">
    //   <SidebarLayout>
    //     {currentUserState.isLoading ? (
    //       <Loader />
    //     ) : (
    //       <>
    //         {videoModalOpen.dashboardVideoModal && (
    //           <VideoModal
    //             isOpen={videoModalOpen.dashboardVideoModal}
    //             onClose={handleVideoModalClose}
    //           />
    //         )}
    //         {showSecondModal && (
    //           <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-75">
    //             <div className="relative bg-white rounded-lg shadow-lg p-4">
    //               <div className="text-center">
    //                 <h2 className="text-xl font-semibold mb-4">
    //                   Disable video popup?
    //                 </h2>

    //                 <button
    //                   onClick={handleDisablePopup}
    //                   className="bg-red-500 text-white px-4 py-2 rounded mr-2"
    //                 >
    //                   Yes
    //                 </button>
    //                 <button
    //                   onClick={() => setShowSecondModal(false)}
    //                   className="bg-green-500 text-white px-4 py-2 rounded"
    //                 >
    //                   No
    //                 </button>
    //                 <h2 className="text-sm p-3 text-gray-600">
    //                   You won't be able to enable it again once disabled
    //                 </h2>
    //               </div>
    //             </div>
    //           </div>
    //         )}
    //   </SidebarLayout>
    // </div>

    //Toaster can be used for popups
    <div className="h-full bg-[#111f36] lg:bg-[#eaeaea] ">
      <SidebarLayout>
        {currentUserState.isLoading ? (
          <Loader />
        ) : (
          <>
            {videoModalOpen.dashboardVideoModal && (
              <VideoModal
                isOpen={videoModalOpen.dashboardVideoModal}
                onClose={handleVideoModalClose}
              />
            )}

            {showSecondModal && (
              <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-75">
                <div className="relative bg-white rounded-lg shadow-lg p-4">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-4">
                      Disable video popup?
                    </h2>

                    <button
                      onClick={handleDisablePopup}
                      className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowSecondModal(false)}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      No
                    </button>
                    <h2 className="text-sm p-3 text-gray-600">
                      You won't be able to enable it again once disabled
                    </h2>
                  </div>
                </div>
              </div>
            )}

            <main className="flex flex-col gap-4 pb-16 pt-8">
              <div className="flex flex-col justify-between gap-4 lg:flex-row">
                <h2 className="text-2xl sm:text-3xl text-white lg:text-gray-700">
                  {greeting}
                  <span className="text-3xl sm:text-4xl ml-1 sm:ml-2 lg:text-black break-words w-full">
                    {currentUserState.userName}
                  </span>
                </h2>
                {/* <SearchBar /> */}
              </div>
              <div className="flex h-full flex-col gap-4 rounded-2xl py-4">
                <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-7 gap-4 mt-4  justify-center h-full">
                  <div
                    className="p-6 rounded-2xl text-center md:col-span-2 md:row-span-1"
                    style={{ background: "#ffa540" }}
                  >
                    <h2>Current Annual Savings</h2>
                    <h2 className="text-3xl md:text-4xl">
                      ${annualCurrentSavings}
                    </h2>
                  </div>

                  <div
                    className="p-6 rounded-2xl text-center md:col-span-2 md:row-span-1"
                    style={{ background: "#51d9a8" }}
                  >
                    <h2>Target Annual Savings</h2>
                    <h2 className="text-3xl md:text-4xl">
                      ${annualTargetSavings}
                    </h2>
                  </div>

                  <div
                    className="p-6 rounded-2xl text-center md:col-span-2 md:row-span-1"
                    style={{ background: "#96c9dd" }}
                  >
                    <h2>Actual Annual Savings</h2>
                    <h2 className="text-3xl md:text-4xl">
                      ${annualActualSavings}
                    </h2>
                  </div>

                  {/* Monthly Bar Graph */}
                  <div className="md:col-span-4 md:row-span-2">
                    {/* <div className="rounded-2xl"> */}
                    {isMonthlyDataReady && (
                      <MonthlyBarGraph monthlyData={monthlyData} />
                    )}
                    {/* </div> */}
                  </div>

                  {/* Doughnut Chart */}
                  <div className="md:col-span-2 md:row-span-2">
                    {isMonthlyDataReady && (
                      <DoughnutData
                        annualTargetSavings={annualTargetSavings}
                        annualCurrentSavings={annualCurrentSavings}
                        annualActualSavings={annualActualSavings}
                      />
                    )}
                  </div>

                  {/* Doughnut Chart */}
                  <div className="md:col-span-6 md:row-span-2">
                    {isMonthlyDataReady && (
                      // <DoughnutData
                      //   annualTargetSavings={annualTargetSavings}
                      //   annualCurrentSavings={annualCurrentSavings}
                      //   annualActualSavings={annualActualSavings}
                      // />
                      <SavingsTrendPrediction expenseAndIncome={monthlyData} />
                    )}
                  </div>
                  {/* Monthly Bar Graph */}
                  <div className="md:col-span-6 md:row-span-2">
                    {/* <div className="rounded-2xl"> */}
                    {isMonthlyDataReady && (
                      <LineChart expenseAndIncome={monthlyData} />
                    )}
                    {/* </div> */}
                  </div>
                </div>
              </div>
            </main>
          </>
        )}
      </SidebarLayout>
    </div>
  );
};

export default Dashboard;
