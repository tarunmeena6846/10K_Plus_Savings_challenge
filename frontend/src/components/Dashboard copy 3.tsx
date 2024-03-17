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
  const [videoModalOpen, setVideoModalOpen] = useState(true);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [myWhyModalOpen, setWhyModalOpen] = useState(false);
  const [myWhyData, setMyWhyData] = useState("");
  const [monthlyData, setMonthlyData] = useState<MonthlyDataItem[]>([]);
  const [isMonthlyDataReady, setIsMonthlyDataReady] = useState(false);
  // const [monthIncExpInfo, setMonthIncExpInfo] = useState([]); // holds the monthly income and expense info along with the items
  const monthIncExpInfo = [
    { name: "Rent", amount: 1000, type: "expense" },
    { name: "Car Insurance", amount: 200, type: "expense" },
    { name: "Internet", amount: 100, type: "expense" },
    { name: "Job", amount: 3000, type: "income" },
    { name: "Freelencing", amount: 1000, type: "income" },
    { name: "Side Hustle", amount: 300, type: "income" },
    { name: "Guitar Lessons", amount: 300, type: "income" },
  ];
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
  const fetchData = async () => {
    try {
      console.log("selectedDate", selectedDate);
      const token = localStorage.getItem("token"); // Get the token from your authentication process
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/data/get-list/${
          selectedDate.year
        }/${selectedDate.month}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log("Monthly data", data);
      if (data.success) {
        setMonthlyIncome(0);
        setMonthlyExpense(0);
        console.log("inside");
        setYearlyExpense(data.yearlyEntry.totalExpenses);
        setYearlyIncome(data.yearlyEntry.totalIncome);
        setProjectedUserData(data.yearlyEntry.projectedYearlySavings);
        console.log("yearly entry:", data.yearlyEntry.monthlyData);

        const allMonthsData = months.map((month) => {
          console.log("month", month);
          const existingEntry = data.yearlyEntry.monthlyData.find(
            (entry: { month: String }) => entry.month === month
          );

          if (existingEntry) {
            const actualSavings =
              existingEntry.monthlyIncome - existingEntry.monthlyExpenses;
            return {
              month,
              actualSavings,
              projectedSaving: data.yearlyEntry.projectedYearlySavings,
            };
          } else {
            return {
              month,
              actualSavings: 0,
              projectedSaving: data.yearlyEntry.projectedYearlySavings,
            };
          }
        });

        console.log("allmonthdata", allMonthsData);
        setMonthlyData(allMonthsData);

        if (data.monthlyEntry) {
          setMonthlyIncome(data.monthlyEntry.monthlyIncome);
          setMonthlyExpense(data.monthlyEntry.monthlyExpenses);
        }
        // return <MonthlyBarGraph allMonthsData={allMonthsData} />;
        setIsMonthlyDataReady(true); // Set the flag to true when data is ready
        if (data.yearlyEntry.projectedYearlySavings === 0) {
          // navigate("/projecteddashboard");
        }
        // setMonthIncExpInfo(data.items);
      } else {
        console.error("Failed to fetch monthly data");
        setMonthlyIncome(0);
        console.log("data", data);
        setProjectedUserData(0);

        setMonthlyExpense(0);
        setYearlyExpense(0);
        setYearlyIncome(0);
        // navigate("/projecteddashboard");
      }

      // console.log("monthlyData", monthlyData);
    } catch (error) {
      console.error("Error fetching monthly data:", error);
      setMonthlyIncome(0);
      setMonthlyExpense(0);
      setYearlyExpense(0);
      setYearlyIncome(0);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate.month, selectedDate.year, setCurrentUserState]); // Run this effect only once when the component mounts

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
      {/* {videoModalOpen && (
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
      {showSecondModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="relative bg-white rounded-lg shadow-lg p-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Choose an option:</h2>
              <button
                onClick={handleDIYClick}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                DIY
              </button>
              <button
                onClick={handleBuyClick}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Buy
              </button>
            </div>
          </div>
        </div>
      
      )} */}

      <VideoModal isOpen={videoModalOpen} onClose={handleVideoModalClose} />
      <SecondModal
        isOpen={showSecondModal}
        onClose={() => setShowSecondModal(false)}
        handleDIYClick={handleDIYClick}
        handleBuyClick={handleBuyClick}
      />
      <div className="grid grid-cols-1 md:grid-rows-6 md:grid-cols-6 gap-4 m-10 ">
        {/* First item takes the full width of the page */}
        <div className="md:col-span-2 row-span-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4">
              <h2 className="text-3xl mb-2" style={{ color: "#454545" }}>
                Welcome Back,
              </h2>
            </div>
            <div className="p-4 col-span-1">
              <img src="./profile.jpg" className="rounded-full h-20 w-20" />
            </div>
            <div className="p-4 col-span-2">
              {/* <Typography variant="h4">{currentUserState.userEmail}</Typography> */}
              <h2 className="text-3xl mb-2">Liss Antony </h2>
            </div>
            <div
              className="p-4 bg-white rounded-2xl col-span-2"
              style={{ background: "#e3bfff" }}
            >
              <Clock></Clock>
            </div>
            <div className="p-6 bg-white rounded-2xl col-span-2 grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-4">
              <div className="flex flex-col">
                <label htmlFor="selectMonth" className="text-sm font-medium">
                  Select Month
                </label>
                <select
                  id="selectMonth"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedDate.month}
                  onChange={(e) =>
                    setSelectedDate({
                      month: e.target.value,
                      year: selectedDate.year,
                    })
                  }
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="selectYear" className="text-sm font-medium">
                  Select Year
                </label>
                <select
                  id="selectYear"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedDate.year}
                  onChange={(e) =>
                    setSelectedDate({
                      year: parseInt(e.target.value),
                      month: selectedDate.month,
                    })
                  }
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* Second item takes the full width of the page */}
        <div className="md:row-span-2">
          <div className="flex flex-col h-full">
            <div
              className="p-6 rounded-2xl flex-grow"
              style={{ background: "#ffcbfb", overflow: "hidden" }}
            >
              <h2>Income</h2>
              <h2 className="text-4xl">${monthlyIncome}</h2>
            </div>
            <div
              className="p-6 rounded-2xl mt-4 flex-grow"
              style={{ background: "#b2edff", overflow: "hidden" }}
            >
              <h2>Expenses</h2>
              <h2 className="text-4xl">${monthlyExpense}</h2>
            </div>
            <div
              className="p-6 rounded-2xl mt-4 flex-grow"
              style={{ background: "#ceffae", overflow: "hidden" }}
            >
              <h2>Savings</h2>
              <h2 className="text-4xl">${monthlyIncome - monthlyExpense}</h2>
            </div>
          </div>
        </div>
        {/* Third item takes the full width of the page */}
        <div className="md:col-span-3 md:row-span-2">
          <div className="h-full w-full bg-white rounded-2xl">
            {isMonthlyDataReady && (
              <MonthlyBarGraph monthlyData={monthlyData} />
            )}
          </div>
        </div>
        {/* Eighth item takes the full width of the page */}
        <div
          className="bg-gray-500 p-4 md:col-span-2 row-span-1 rounded-2xl"
          style={{
            background: "#b2ecff",
          }}
        >
          <div className="flex justify-center flex-col items-center">
            <h2 className="p-2 text-3xl"> My WHY?</h2>
            {currentUserState.myWhy === "" ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 1 }} // Define hover animation
                className="rounded-3xl text-black pr-3 p-2 "
                onClick={() => setWhyModalOpen(true)}
              >
                Click to set your savings goal
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 1 }} // Define hover animation
                className="rounded-3xl text-black pr-3 p-2 "
                onClick={() => setWhyModalOpen(true)}
              >
                {currentUserState.myWhy}
              </motion.button>
            )}
            <Modal
              open={myWhyModalOpen}
              // onClose={() => setWhyModalOpen(false)}
              // id={"mywhymodal"}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  bgcolor: "background.paper",
                  padding: 4,
                  // width: "50%",
                  // height: "50%",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <div className="flex flex-col items-center p-5 gap-10 justify-center">
                  <h1 className="text-3xl">
                    Discover Your Purpose, Fuel Your Savings Journey
                  </h1>
                  <motion.input
                    className=" rounded-2xl border border-blue-500 p-2 w-80"
                    value={currentUserState.myWhy}
                    maxLength={100}
                    onChange={(e) =>
                      setCurrentUserState((currVal) => ({
                        ...currVal,
                        myWhy: e.target.value,
                      }))
                    }
                  ></motion.input>
                  <div className="m-3">
                    <CustomeButton onClick={handleSaveMyWhy}>
                      Save
                    </CustomeButton>

                    <CustomeButton onClick={() => setWhyModalOpen(false)}>
                      Cancel
                    </CustomeButton>
                  </div>
                </div>
              </Box>
            </Modal>
          </div>
        </div>
        {/* Fourth item takes the full width of the page
        <div
          className="bg-red-500 p-4 row-span-1 rounded-2xl"
          style={{
            background: "#ffccfb",
          }}
        >
          <div className="flex justify-center flex-col">
            <h2 className="p-2"> Target Annual Savings</h2>
            <h2 className="text-4xl">{`$${monthlyIncome}`}</h2>
          </div>
        </div>
        <div
          className="p-4 rounded-2xl"
          style={{
            background: "#b2ecff",
          }}
        >
          <div className="flex justify-center flex-col">
            <h2 className="p-2"> Actual Annual Savings</h2>
            <h2 className="text-4xl">{`$${monthlyIncome}`}</h2>
          </div>
        </div> */}
        {/* Sixth item takes the full width of the page */}
        <div className="p-4 md:col-span-2 row-span-2 rounded-2xl bg-white">
          <MonthlyChart
            monthlyIncome={500}
            // monthlyIncome={0}
            monthlyExpenses={200}
          />
        </div>
        {/* Seventh item takes the full width of the page */}
        <div
          className="pt-6 md:col-span-2 row-span-2 flex flex-col items-center"
          style={{
            borderRadius: "20px",
            background: "white",
            overflow: "hidden",
          }}
        >
          <h2 className="mb-4 text-center">Monthly Income</h2>
          <Button
            style={{
              minWidth: "100px",
              color: "green",
              border: "2px dotted green",
              borderRadius: "20px",
              margin: "10px",
              textTransform: "none",
            }}
            variant="outlined"
            onClick={() => navigate("/monthlyIncome")}
          >
            + Add Income
          </Button>
          {/* Render the updated items */}
          {monthIncExpInfo.length > 0 ? (
            <div style={{ padding: "10px", width: "100%" }}>
              {monthIncExpInfo
                .filter((item) => item.type === "income")
                .map((item, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#b6ff8b",
                      padding: "8px",
                      margin: "10px",
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ flex: 1 }}>{item.name}</span>
                    <span>
                      $
                      {item.amount.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                ))}
            </div>
          ) : null}
        </div>
        {/* Fourth item takes the full width of the page */}
        <div
          className="bg-red-500 p-4 row-span-1 rounded-2xl"
          style={{
            background: "#ffccfb",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between", // Align items with equal space between them
          }}
        >
          <div className="flex justify-center flex-col">
            <h2 className="p-2"> Target Annual Savings</h2>

            <h2 className="text-4xl">{`$${monthlyIncome}`}</h2>
          </div>

          <Button
            style={{
              // minWidth: "100px",
              color: "black",
              border: "2px dotted black",
              borderRadius: "20px",
              margin: "10px",
              textTransform: "none",
            }}
            variant="outlined"
            // onClick={() => navigate("/monthlyIncome")}
          >
            + Add Target
          </Button>
        </div>
        {/* Fifth item takes the full width of the page */}
        <div
          className="p-4 rounded-2xl"
          style={{
            background: "#b2ecff",
          }}
        >
          <div className="flex justify-center flex-col">
            <h2 className="p-2"> Actual Annual Savings</h2>
            <h2 className="text-4xl">{`$${monthlyIncome}`}</h2>
          </div>
        </div>
        {/* Eighth item takes the full width of the page */}
        {/* <div
          className="bg-gray-500 p-4 md:col-span-2 row-span-1 rounded-2xl"
          style={{
            background: "#b2ecff",
          }}
        >
          <div className="flex justify-center flex-col">
            <h2 className="p-2"> Target Annual Expenses</h2>
            <h2 className="text-4xl">{`$${monthlyIncome}`}</h2>
          </div>
        </div> */}
        {/* Ninth item takes the full width of the page */}
        {/* Eighth item takes the full width of the page */}
        <div
          className="pt-6 md:col-span-3 row-span-2 flex flex-col items-center"
          style={{
            borderRadius: "20px",
            background: "white",
            overflow: "hidden",
          }}
        >
          <h2 className="mb-4 text-center">Monthly Expenses</h2>
          <Button
            style={{
              minWidth: "100px",
              color: "green",
              border: "2px dotted green",
              borderRadius: "20px",
              margin: "10px",
              textTransform: "none",
            }}
            variant="outlined"
            onClick={() => navigate("/monthlyIncome")}
          >
            + Add Expenses
          </Button>
          {/* Render the updated items */}
          {monthIncExpInfo.length > 0 ? (
            <div style={{ padding: "10px", width: "100%" }}>
              {monthIncExpInfo
                .filter((item) => item.type === "expense")
                .map((item, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#b6ff8b",
                      padding: "8px",
                      margin: "10px",
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ flex: 1 }}>{item.name}</span>
                    <span>
                      $
                      {item.amount.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                ))}
            </div>
          ) : null}
        </div>
        <div
          className="pt-6 md:col-span-3 row-span-2 flex flex-col items-center"
          style={{
            borderRadius: "20px",
            background: "white",
            overflow: "hidden",
          }}
        >
          <div>
            <h2 className="mb-4 text-center">Annual Expenses</h2>
          </div>
          {/* Render the updated items */}
          {monthIncExpInfo.length > 0 ? (
            <div style={{ padding: "10px", width: "100%" }}>
              {monthIncExpInfo
                .filter((item) => item.type === "expense")
                .map((item, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#b6ff8b",
                      padding: "8px",
                      margin: "10px",
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ flex: 1 }}>{item.name}</span>
                    <span>
                      $
                      {item.amount.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                ))}
            </div>
          ) : null}
        </div>{" "}
      </div>
    </div>
  );
};

export default Dashboard;
