import React, { useEffect, useState, useRef } from "react";
import { Modal, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { monthlyExpenseState, monthlyIncomeState } from "./store/atoms/total";
import MonthlyChart from "./MonthlyChart";
import MonthlyBarGraph from "./MonthlyBarGraph";
import { userState } from "./store/atoms/user";
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
  const [videoModalOpen, setVideoModalOpen] = useState(false);
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
  // Fetch monthly data from the backend
  // const fetchData = async () => {
  //   try {
  //     console.log("selectedDate", selectedDate);
  //     const token = localStorage.getItem("token"); // Get the token from your authentication process
  //     const response = await fetch(
  //       `${import.meta.env.VITE_SERVER_URL}/data/get-list/${
  //         selectedDate.year
  //       }/${selectedDate.month}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     const data = await response.json();
  //     console.log("Monthly data", data);
  //     if (data.success) {
  //       setMonthlyIncome(0);
  //       setMonthlyExpense(0);
  //       console.log("inside");
  //       setYearlyExpense(data.yearlyEntry.totalExpenses);
  //       setYearlyIncome(data.yearlyEntry.totalIncome);
  //       setProjectedUserData(data.yearlyEntry.projectedYearlySavings);
  //       console.log("yearly entry:", data.yearlyEntry.monthlyData);

  //       const allMonthsData = months.map((month) => {
  //         console.log("month", month);
  //         const existingEntry = data.yearlyEntry.monthlyData.find(
  //           (entry: { month: String }) => entry.month === month
  //         );

  //         if (existingEntry) {
  //           const actualSavings =
  //             existingEntry.monthlyIncome - existingEntry.monthlyExpenses;
  //           return {
  //             month,
  //             actualSavings,
  //             projectedSaving: data.yearlyEntry.projectedYearlySavings,
  //           };
  //         } else {
  //           return {
  //             month,
  //             actualSavings: 0,
  //             projectedSaving: data.yearlyEntry.projectedYearlySavings,
  //           };
  //         }
  //       });

  //       console.log("allmonthdata", allMonthsData);
  //       setMonthlyData(allMonthsData);

  //       if (data.monthlyEntry) {
  //         setMonthlyIncome(data.monthlyEntry.monthlyIncome);
  //         setMonthlyExpense(data.monthlyEntry.monthlyExpenses);
  //       }
  //       // return <MonthlyBarGraph allMonthsData={allMonthsData} />;
  //       setIsMonthlyDataReady(true); // Set the flag to true when data is ready
  //       if (data.yearlyEntry.projectedYearlySavings === 0) {
  //         // navigate("/projecteddashboard");
  //       }
  //       // setMonthIncExpInfo(data.items);
  //     } else {
  //       console.error("Failed to fetch monthly data");
  //       setMonthlyIncome(0);
  //       console.log("data", data);
  //       setProjectedUserData(0);

  //       setMonthlyExpense(0);
  //       setYearlyExpense(0);
  //       setYearlyIncome(0);
  //       // navigate("/projecteddashboard");
  //     }

  //     // console.log("monthlyData", monthlyData);
  //   } catch (error) {
  //     console.error("Error fetching monthly data:", error);
  //     setMonthlyIncome(0);
  //     setMonthlyExpense(0);
  //     setYearlyExpense(0);
  //     setYearlyIncome(0);
  //   }
  // };

  useEffect(() => {
    const savingsData = fetchData(
      new Date().getFullYear(),
      new Date().toLocaleString("default", { month: "long" }),
      "savingsdashboard"
    );

    if (savingsData.success === true) {
      setAnnualActualSavings(savingsData.annualActualSavings);
      setAnnualTargetSavings(savingsData.annualTargetSavings);
      setAnnualCurrentSavings(savingsData.annualCurrentSavings);
      setMonthlyData(savingsData.monthWiseData);
    }
  }, []); // Run this effect only once when the component mounts

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
    setVideoModalOpen(false);
    setShowSecondModal(true); // Show the second modal when the first modal is closed
  };
  const handleDIYClick = () => {
    setShowSecondModal(false); // Show the second modal when the first modal is closed

    // Handle DIY button click
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
    // await StripeCheckout("price_1OjffbSBiPFrlsnb4MjS068p", "payment");
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
            <div className="h-full w-full bg-white rounded-2xl">
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
