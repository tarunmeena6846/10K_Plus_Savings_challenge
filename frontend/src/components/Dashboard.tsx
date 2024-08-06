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
  const [monthlyIncome, setMonthlyIncome] = useRecoilState(monthlyIncomeState);
  const [monthlyExpense, setMonthlyExpense] =
    useRecoilState(monthlyExpenseState);
  const [yearlyIncome, setYearlyIncome] = useState(0);
  const [yearlyExpense, setYearlyExpense] = useState(0);
  // const defaultVideoModalState = useRecoilValue(videoModalState);

  // const [videoModalOpen, setVideoModalOpen] = useState(true); // Video modal state variable
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
  const [userDetails, setUserDetails] = useState({
    newPassword: "",
  });
  const [selectedDate, setSelectedDate] = useRecoilState(dateState);
  const [projectedUserData, setProjectedUserData] = useState(0);

  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false);
  const handleReset = () => {
    setCurrentUserState({
      userEmail: currentUserState.userEmail,
      isLoading: currentUserState.isLoading,
      imageUrl: "",
      isVerified: currentUserState.isVerified,
      myWhy: currentUserState.myWhy,
      isAdmin: currentUserState.isAdmin,
    });
  };
  const handleOpenSettingsDialog = () => {
    setSettingsDialogOpen(true);
  };

  const handleCloseSettingsDialog = () => {
    setSettingsDialogOpen(false);
  };

  const handleOpenIncomeDialog = () => {
    setIncomeDialogOpen(true);
  };

  const handleCloseIncomeDialog = () => {
    setIncomeDialogOpen(false);
  };

  const handleAddTarget = (targetSavings) => {
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
            projectedYearlySavings: targetSavings,
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
            console.log(
              "response data at update projeted savings",
              responseData
            );

            // setCourses(data);
            if (responseData.success == true) {
              // Clear items array after saving
              // setMonthlyExpense(responseData.totalExpenses);
              // navigate("/swotportal");
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
  };
  console.log("selectedDate at dashboard", selectedDate);

  const handleSaveIncome = async () => {
    // if (monthlyIncome === 0 || monthlyExpense === 0) {
    //   alert("Invalid Income or Expenses");
    //   return;
    // }
    console.log("save income is called", monthlyIncome, monthlyExpense);

    try {
      await fetch(`${import.meta.env.VITE_SERVER_URL}/data/save-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          monthlyExpense: monthlyExpense,
          monthlyIncome: monthlyIncome,
          year: selectedDate.year,
          month: selectedDate.month,
        }),
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error("Network response is not ok");
          }
          resp.json().then((responseData) => {
            console.log(
              "response data at save item monthly income",
              responseData
            );

            if (responseData.success) {
              // setItems([]);
              setCurrentUserState({
                userEmail: currentUserState.userEmail,
                isLoading: false,
                imageUrl: currentUserState.imageUrl,
                isVerified: currentUserState.isVerified,
                myWhy: currentUserState.myWhy,
                isAdmin: currentUserState.isAdmin,
              });
              setIncomeDialogOpen(false);
              fetchData();
            } else {
              console.error("Error saving Income:", responseData.error);
            }
          });
        })
        .catch((error) => {
          console.error("Error signing in email");
          setIncomeDialogOpen(false);
          navigate("/login");
        });
    } catch (error: any) {
      setIncomeDialogOpen(false);
      console.error("Error saving income:", error.message);
      navigate("/dashboard");
    }
  };
  const handleResetIncomeDialog = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_SERVER_URL}/data/reset-monthly-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            month: selectedDate.month,
            year: selectedDate.year,
          }),
        }
      )
        .then((resp) => {
          if (!resp.ok) {
            throw new Error("Network response is not ok");
          }
          resp.json().then((responseData) => {
            if (responseData.success) {
              if (responseData.deleted) {
                setIncomeDialogOpen(false);
                fetchData();
              } else {
                setIncomeDialogOpen(false);

                alert("No data for the given Month and Year");
              }
            } else {
              setIncomeDialogOpen(false);

              console.error(
                "Error resetting monthly data:",
                responseData.error
              );
              navigate("/login");
            }
          });
        })
        .catch((error) => {
          console.error("Error resetting monthly data:", error.message);
          setIncomeDialogOpen(false);
        });
    } catch (error: any) {
      console.error("Error resetting monthly data:", error.message);
      setIncomeDialogOpen(false);
    }
    console.log("reset called");
  };
  const handleSaveSettingsDialog = async () => {
    console.log("image link", currentUserState.imageUrl);
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/change-user_details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            username: currentUserState.userEmail,
            newPassword: userDetails.newPassword,
            imageUrl: currentUserState.imageUrl,
          }),
        }
      );

      if (!resp.ok) {
        throw new Error("Network response is not ok");
      }
      const data = await resp.json();
      if (data.success) {
        console.log(data);
        setSettingsDialogOpen(false);
        // alert("Password Changed Successfully");
      }
    } catch (error) {
      alert("Error Changing email");
      setSettingsDialogOpen(false);
      navigate("/login");
      console.error("Error signing in email");
    }
  };
  useEffect(() => {
    const fetchDataAsync = async () => {
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
    };
    fetchDataAsync();
  }, []); // Run this effect only once when the component mounts
  console.log(monthlyData);
  useEffect(() => {
    // Check if the necessary data is available before navigating
    if (currentUserState.userEmail && !currentUserState.isLoading) {
      navigate("/dashboard");
    }
  }, [
    currentUserState.userEmail,
    currentUserState.isLoading,
    navigate,
    setCurrentUserState,
  ]);

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
  return (
    <div>
      <SidebarLayout>
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
        <div className="grid grid-cols-1 md:grid-rows-3 md:grid-cols-3 gap-4">
          <div
            className="p-6 rounded-2xl"
            style={{ background: "#ffcbfb", overflow: "hidden" }}
          >
            <h2>Current Savings</h2>
            <h2 className="text-4xl">${annualCurrentSavings}</h2>
          </div>
          <div
            className="p-6 rounded-2xl"
            style={{ background: "#b2edff", overflow: "hidden" }}
          >
            <h2>Target Savings</h2>
            <h2 className="text-4xl">${annualTargetSavings}</h2>
          </div>
          <div
            className="p-6 rounded-2xl"
            style={{ background: "#ceffae", overflow: "hidden" }}
          >
            <h2>Actual Savings</h2>
            <h2 className="text-4xl">${annualActualSavings}</h2>
          </div>
          <div className="col-span-3 md:row-span-2">
            <div
              className="h-full w-full rounded-2xl"
              // style={{ maxHeight: "200px" }}
            >
              {isMonthlyDataReady && (
                <MonthlyBarGraph monthlyData={monthlyData} />
              )}
            </div>
          </div>
          {/* <div className="p-4 col-span-1 row-span-2 rounded-2xl bg-white">
            <MonthlyChart monthlyIncome={500} monthlyExpenses={200} />
          </div> */}
        </div>
      </SidebarLayout>
    </div>
  );
};

export default Dashboard;
