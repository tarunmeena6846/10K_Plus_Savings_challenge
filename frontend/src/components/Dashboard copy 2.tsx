import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  Typography,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Avatar,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { monthlyExpenseState, monthlyIncomeState } from "./store/atoms/total";
// import MonthlyChart from "./MonthlyChart";
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
export interface MonthlyDataItem {
  month: string;
  actualSavings: number;
  projectedSaving: number; // Replace 'any' with the actual type
}

function Dashboard() {
  const navigate = useNavigate();
  const [monthlyIncome, setMonthlyIncome] = useRecoilState(monthlyIncomeState);
  const [monthlyExpense, setMonthlyExpense] =
    useRecoilState(monthlyExpenseState);
  const [yearlyIncome, setYearlyIncome] = useState(0);
  const [yearlyExpense, setYearlyExpense] = useState(0);

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
        navigate("/projecteddashboard");
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
    <div className="grid-container" style={{ margin: "20px" }}>
      <div
        className="grid-item item1"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* <UserAvatar userEmail={currentUserState.userEmail} size={50} /> */}
        <label htmlFor="avatar-upload">
          <Avatar
            alt="Edit Avatar"
            src={currentUserState.imageUrl}
            style={{
              position: "absolute",
              width: "90px",
              height: "90px",
            }}
          />
        </label>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "70px",
          }}
        >
          <Typography variant="h4" style={{ color: "#454545" }}>
            Welcome Back,
          </Typography>
          <span
            style={{
              textShadow: "1px 1px 1px black", // Border color for "Here"
              color: "black",
              // Optional: Add padding for spacing
            }}
          >
            <Typography variant="h4">{currentUserState.userEmail}</Typography>
          </span>
        </div>
      </div>
      <div
        className="grid-item item2 "
        style={{
          borderRadius: "20px",
          background: "#e3c0ff",
          overflow: "hidden",
          // height: "130px",
        }}
      >
        <Typography
          variant="body1"
          style={{
            color: "#454545",
          }}
        >
          Projected Annual Savings
        </Typography>

        <Typography variant="h4">
          $
          {(projectedUserData * 12).toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}
        </Typography>
      </div>
      <div
        className="grid-item item13 "
        style={{
          marginTop: "0px",
          background: "#b2ecff",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="body1"
          style={{
            color: "#454545",
          }}
        >
          Actual Annual Savings
        </Typography>
        <Typography variant="h4">
          $
          {(yearlyIncome - yearlyExpense).toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}
        </Typography>
      </div>
      <div
        className="grid-item item3"
        style={{
          background: "#ffccfb",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="body1"
          style={{
            color: "#454545",
          }}
        >
          Projected Monthly Savings
        </Typography>
        <Typography variant="h4">
          $
          {projectedUserData.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}
        </Typography>
      </div>
      <div
        className="grid-item item4"
        style={{
          background: "#b2ecff",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="body1"
          style={{
            color: "#454545",
          }}
        >
          Actual Monthly Savings
        </Typography>
        <Typography variant="h4">
          $
          {(monthlyIncome - monthlyExpense).toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}
        </Typography>
      </div>
      <div
        className="grid-item item6"
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          // overflow: "hidden",
        }}
      >
        {isMonthlyDataReady && <MonthlyBarGraph monthlyData={monthlyData} />}
        {/* </Card> */}
      </div>
      <div
        className="grid-item item12"
        style={{
          borderRadius: "20px", // width: "500px",
          background: "white",
        }}
      >
        <div style={{ margin: "20px" }}>
          <FormControl variant="outlined" style={{ padding: "10px" }}>
            <InputLabel>Select Month</InputLabel>
            <Select
              value={selectedDate.month}
              onChange={(e) =>
                setSelectedDate({
                  month: e.target.value,
                  year: selectedDate.year,
                })
              }
              label="Select Month"
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="outlined" style={{ padding: "10px" }}>
            <InputLabel>Select Year</InputLabel>
            <Select
              value={selectedDate.year}
              onChange={(e) =>
                setSelectedDate({
                  year: e.target.value as number,
                  month: selectedDate.month,
                })
              }
              label="Select Year"
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <br />
        <br />
        <div>
          <Clock></Clock>
        </div>
        <div style={{ padding: "20px" }}>
          <Button
            style={{
              color: "black",
            }}
            size="large"
            onClick={handleOpenSettingsDialog}
            startIcon={<SettingsIcon />}
          ></Button>
        </div>

        <Dialog
          open={settingsDialogOpen}
          onClose={handleCloseSettingsDialog}
          aria-labelledby="settings-dialog-title"
          // maxWidth="md" // Set maxWidth to control the maximum width
          fullWidth
        >
          <DialogTitle id="settings-dialog-title"></DialogTitle>
          <DialogContent>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center", // Center items horizontally
                height: "100%",
              }}
            >
              <UserAvatar
                // userEmail="user@example.com"
                size={50}
                // onImageChange={handleImageChange}
              />
              <br />
              <Typography variant="h6">
                Hello {currentUserState.userEmail}
              </Typography>
              <br />
              <TextField
                label="Email"
                variant="outlined"
                type={"email"}
                value={currentUserState.userEmail}
                fullWidth
              />
              <br />
              <br />
              <TextField
                onChange={(e) => {
                  setUserDetails({
                    newPassword: e.target.value,
                  });
                }}
                label="Password"
                variant="outlined"
                type={"password"}
                fullWidth
              />
              <br />
              <br></br>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              style={{ textTransform: "none" }}
              onClick={handleSaveSettingsDialog}
            >
              Save
            </Button>
          </DialogActions>
          <DialogActions>
            <Button style={{ textTransform: "none" }} onClick={handleReset}>
              Reset Image
            </Button>
          </DialogActions>
          <DialogActions>
            <Button
              style={{ textTransform: "none" }}
              onClick={handleCloseSettingsDialog}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div
        className="grid-item item7"
        style={{ borderRadius: "20px", background: "white" }}
      >
        {/* <MonthlyChart
          monthlyIncome={monthlyIncome}
          monthlyExpenses={monthlyExpense}
        /> */}
      </div>
      <div
        className="grid-item item8"
        style={{
          borderRadius: "20px",
          background: "white", // width: "500px",

          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Typography style={{ margin: "20px" }} variant="h6">
          Monthly Income
        </Typography>
        <Button
          style={{
            minWidth: "100px",
            color: " green",
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
          <div style={{ textAlign: "start", padding: "10px" }}>
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
                    justifyContent: "space-between", // Space content horizontally
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
        className="grid-item item9"
        style={{
          borderRadius: "20px",
          background: "white", // width: "500px",

          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Typography style={{ margin: "20px" }} variant="h6">
          Monthly Expenses
        </Typography>
        <Button
          style={{
            minWidth: "100px",
            color: " green",
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
          <div style={{ textAlign: "start", padding: "10px" }}>
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
                    justifyContent: "space-between", // Space content horizontally
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
        className="grid-item item10"
        style={{
          borderRadius: "20px",
          background: "white", // width: "500px",

          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {" "}
        <Typography style={{ margin: "20px" }} variant="h6">
          Annual Expenses
        </Typography>
        {/* Render the updated items */}
        {monthIncExpInfo.length > 0 ? (
          <div style={{ textAlign: "start", padding: "10px" }}>
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
                    justifyContent: "space-between", // Space content horizontally
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
      {/* <div
        className="grid-item item8"
        style={{
          borderRadius: "20px",
          background: "white", // width: "500px",

          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        <Dialog
          open={incomeDialogOpen}
          onClose={handleCloseIncomeDialog}
          aria-labelledby="income-dialog-title"
          fullWidth
        >
          <DialogTitle id="income-dialog-title"></DialogTitle>
          <DialogContent>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center", // Center items horizontally
                height: "100%",
              }}
            >
              <Typography style={{ paddingBottom: "10px" }}>
                Update Monthly Income and Expenses{" "}
              </Typography>
              <TextField
                label="Monthly Income"
                variant="outlined"
                type="Number"
                fullWidth
                style={{ marginTop: "10px" }}
                value={monthlyIncome}
                onChange={(e) => {
                  // Parse the input value to a number
                  const inputValue = parseFloat(e.target.value);
                  // Check if the parsed value is a valid number
                  if (!isNaN(inputValue)) {
                    setMonthlyIncome(inputValue);
                  } else {
                    alert("Invalid Input");
                  }
                }}
              />
              <br />
              <br />
              <TextField
                onChange={(e) => {
                  // Parse the input value to a number
                  const inputValue = parseFloat(e.target.value);
                  // Check if the parsed value is a valid number
                  if (!isNaN(inputValue)) {
                    setMonthlyExpense(inputValue);
                  } else {
                    alert("Invalid Input");
                  }
                }}
                label="Monthly Expenses"
                variant="outlined"
                fullWidth
                type="number"
                value={monthlyExpense}
              />
              <br />
              <br />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              style={{ textTransform: "none" }}
              onClick={handleSaveIncome}
            >
              Save
            </Button>
          </DialogActions>
          <DialogActions>
            <Button
              style={{ textTransform: "none" }}
              onClick={handleResetIncomeDialog}
            >
              Reset
            </Button>
          </DialogActions>
          <DialogActions>
            <Button
              style={{ textTransform: "none" }}
              onClick={handleCloseIncomeDialog}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <div>
          <Typography
            variant="h4"
            style={{
              paddingTop: "20px",
              color: "#454545",
            }}
          >
            Monthly Income
          </Typography>
          <Typography variant="h5">{`$${monthlyIncome}`}</Typography>
          <Typography
            variant="h4"
            style={{ paddingTop: "50px", color: "#454545" }}
          >
            Monthly Expenses
          </Typography>
          <Typography variant="h5">{`$${monthlyExpense}`}</Typography>
        </div>
        <div style={{ marginTop: "auto" }}>
          <Button
            style={{
              minWidth: "100px",
              color: " green",
              border: "2px dotted green",
              borderRadius: "20px",
              margin: "10px",
              textTransform: "none",
            }}
            variant="outlined"
            onClick={handleOpenIncomeDialog}
          >
            + Income & Expenses
          </Button>
          <Button
            style={{
              minWidth: "100px",
              color: " green",
              border: "2px dotted green",
              borderRadius: "20px",
              margin: "10px",
              textTransform: "none",
            }}
            variant="outlined"
            onClick={() => {
              navigate("/projecteddashboard");
            }}
          >
            Update Projected Savings
          </Button>
        </div>
      </div> */}
    </div>
  );
}

export default Dashboard;
