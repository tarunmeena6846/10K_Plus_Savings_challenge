import React, { useEffect, useState } from "react";
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

function Dashboard() {
  const navigate = useNavigate();

  // Assuming these are your Recoil state variables
  const [monthlyIncome, setMonthlyIncome] = useRecoilState(monthlyIncomeState);
  const [monthlyExpense, setMonthlyExpense] =
    useRecoilState(monthlyExpenseState);
  const [yearlyIncome, setYearlyIncome] = useState(0);
  const [yearlyExpense, setYearlyExpense] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [monthlyItems, setMonthlyItems] = useState([]);

  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [userDetails, setUserDetails] = useState({
    newPassword: "",
  });
  const [selectedDate, setSelectedDate] = useRecoilState(dateState);
  const [projectedData, setProjectedData] = useState({
    projectedMonthlyData: [],
    projectedAnnualSaving: 0,
    projectedAnnualExpense: 0,
  });
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  const handleOpenSettingsDialog = () => {
    setSettingsDialogOpen(true);
  };

  const handleCloseSettingsDialog = () => {
    setSettingsDialogOpen(false);
  };
  const handleSaveSettingsDialog = () => {
    fetch("http://localhost:3000/admin/change-user_details", {
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
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Network response is not ok");
          setCurrentUserState({
            userEmail: null,
            isLoading: false,
            imageUrl: "",
          });
        }
        resp.json().then((data) => {
          console.log(data);
          setSettingsDialogOpen(false);
        });
      })
      .catch((error) => {
        alert("Error Changing email");
        console.error("Error signing in email");
        setCurrentUserState({
          userEmail: null,
          isLoading: false,
          imageUrl: "",
        });
      });
  };

  const handleImageChange = (imageUrl) => {
    setUserDetails({
      newPassword: userDetails.newPassword,
    });
  };

  useEffect(() => {
    console.log("tarun useeffect 1", selectedDate);

    // Fetch monthly data from the backend
    const fetchData = async () => {
      try {
        console.log("selectedDate", selectedDate);
        const token = localStorage.getItem("token"); // Get the token from your authentication process
        const response = await fetch(
          `http://localhost:3000/admin/get-list/${selectedDate.year}/${selectedDate.month}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Monthly Data:", data);

          console.log("Monthly Data:", data.items);
          setMonthlyData(data.items);
          setMonthlyIncome(data.totalIncome);
          setMonthlyExpense(data.totalExpenses);
          console.log("tarun selectedDate", selectedDate);
          console.log(
            "tarun useeffecte inside 1 before",
            monthlyData,
            monthlyIncome,
            monthlyExpense
          );
          if (selectedDate.month === "January") {
            // projectedMonthlyData = monthlyData;
            // projectedAnnualSaving = (monthlyIncome - monthlyExpense) * 12;
            // projectedAnnualExpense = monthlyExpense * 12;
            console.log(
              "tarun useeffecte inside 1",
              monthlyData,
              monthlyIncome,
              monthlyExpense
            );
            setProjectedData((prevData) => ({
              ...prevData,
              projectedMonthlyData: data.items,
              projectedAnnualSaving:
                (data.totalIncome - data.totalExpenses) * 12,
              projectedAnnualExpense: data.totalExpenses * 12,
            }));
          }
          // Process the data as needed in your frontend
        } else {
          console.error("Failed to fetch monthly data");
          setMonthlyIncome(0);
          setMonthlyExpense(0);
          setMonthlyData([]);
          setCurrentUserState({
            userEmail: null,
            isLoading: false,
            imageUrl: "",
          });
        }
      } catch (error) {
        console.error("Error fetching monthly data:", error);
        setMonthlyIncome(0);
        setMonthlyExpense(0);
        setMonthlyData([]);
        setCurrentUserState({
          userEmail: null,
          isLoading: false,
          imageUrl: "",
        });
      }
    };

    fetchData();
  }, [
    selectedDate.month,
    selectedDate.year,
    currentUserState.userEmail,
    currentUserState.isLoading,
    navigate,
    setCurrentUserState,
    // setProjectedData,
    setMonthlyIncome,
    // setCurrentUserState,
    // setMonthlyExpense,
    // setMonthlyData,
  ]); // Run this effect only once when the component mounts

  useEffect(() => {
    // Fetch monthly data from the backend
    console.log("tarun useeffect 2", selectedDate);

    const fetchYearlyData = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from your authentication process
        const response = await fetch(
          `http://localhost:3000/admin/get-yearly-list/${selectedDate.year}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Yearly Data:", data);
          setYearlyData(data.commonItems);
          setYearlyIncome(data.yearlyIncome);
          setYearlyExpense(data.yearlyExpense);
          setMonthlyItems(data.items);
          console.log(yearlyExpense, yearlyIncome);
          console.log("tarun", selectedDate);
          console.log(
            "tarun useeffecte inside 2 before",
            monthlyData,
            monthlyIncome,
            monthlyExpense
          );
        } else {
          console.error("Failed to fetch yearly data");
          setCurrentUserState({
            userEmail: null,
            isLoading: false,
            imageUrl: "",
          });
        }
      } catch (error) {
        console.error("Error fetching yearly data:", error);
        setCurrentUserState({
          userEmail: null,
          isLoading: false,
          imageUrl: "",
        });
      }
    };

    fetchYearlyData();
  }, [selectedDate, setMonthlyIncome, setCurrentUserState]); // Run this effect only once when the component mounts

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
      navigate("/");
    }
  }, [
    currentUserState.userEmail,
    currentUserState.isLoading,
    navigate,
    setCurrentUserState,
  ]);
  return (
    <div class="grid-container" style={{ margin: "20px" }}>
      <div class="grid-item item1">
        {/* <UserAvatar userEmail={currentUserState.userEmail} size={50} /> */}
        <label htmlFor="avatar-upload">
          <Avatar
            alt="Edit Avatar"
            src={currentUserState.imageUrl}
            style={{
              position: "absolute",
              // top: 0,
              // left: 0,
              width: "90px",
              height: "90px",
            }}
          />
        </label>
        <Typography variant="h5">Welcome Back</Typography>
        <Typography variant="h2">{currentUserState.userEmail}</Typography>
      </div>
      <div class="grid-item item2 " style={{ marginTop: "0px" }}>
        <Card style={{ borderRadius: "20px", background: "#e3c0ff" }}>
          <CardContent>
            <Typography variant="body1"> Projected Annual Savings </Typography>
            <Typography variant="h4">
              $
              {projectedData.projectedAnnualSaving.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
            </Typography>
          </CardContent>
        </Card>
      </div>
      <div class="grid-item item13 " style={{ marginTop: "0px" }}>
        <Card style={{ borderRadius: "20px", background: "#b2ecff" }}>
          <CardContent>
            <Typography variant="body1">Annual Savings </Typography>
            <Typography variant="h4">
              $
              {(yearlyIncome - yearlyExpense).toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
            </Typography>
          </CardContent>
        </Card>
      </div>
      <div class="grid-item item3">
        <Card
          style={{
            background: "#ffccfb",
            borderRadius: "20px",
            // minHeight: "100px",
          }}
        >
          <CardContent>
            <Typography variant="body1"> Monthly Income </Typography>
            <Typography variant="h4">
              $
              {monthlyIncome.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
            </Typography>
          </CardContent>
        </Card>
      </div>
      <div class="grid-item item4">
        <Card
          style={{
            background: "#b2ecff",
            borderRadius: "20px",
            // minHeight: "100px",
          }}
        >
          <CardContent>
            <Typography variant="body1"> Monthly Expenses</Typography>
            <Typography variant="h4">
              $
              {monthlyExpense.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
            </Typography>
          </CardContent>
        </Card>
      </div>
      <div class="grid-item item5">
        <Card
          style={{
            background: "#ceffb1",
            borderRadius: "20px",
            // minHeight: "100px",
          }}
        >
          <CardContent>
            <Typography variant="body1"> Monthly Savings</Typography>

            <Typography variant="h4">
              $
              {(monthlyIncome - monthlyExpense).toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
            </Typography>
          </CardContent>
        </Card>
      </div>
      <div class="grid-item item6">
        <Card
          style={{ background: "", minHeight: "400px", borderRadius: "20px" }}
        >
          <MonthlyBarGraph
            // style={{ minHeight: "10px" }}
            monthlyData={monthlyItems}
            // width="0%" // Adjust the width as needed
          />
        </Card>
      </div>
      <div class="grid-item item12">
        <Card
          style={{
            // height: "15vh",
            minHeight: "400px",
            borderRadius: "20px", // width: "500px",
            // cursor: "pointer",
            // background: "rgb(255, 99, 132)",
            // background: "#58D68D",
            // background: "#ceffb1",

            color: "black",
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
              {/* {selectedDate.year} */}
              <Select
                value={selectedDate.year}
                onChange={(e) =>
                  setSelectedDate({
                    year: e.target.value,
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
                // variant="outlined"
                color: "black",
              }}
              size="large"
              onClick={handleOpenSettingsDialog}
              startIcon={<SettingsIcon />}
            ></Button>
          </div>
        </Card>

        <Dialog
          open={settingsDialogOpen}
          onClose={handleCloseSettingsDialog}
          aria-labelledby="settings-dialog-title"
        >
          <DialogTitle id="settings-dialog-title"></DialogTitle>
          <DialogContent>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <UserAvatar
                userEmail="user@example.com"
                size={50}
                onImageChange={handleImageChange}
              />
              <br />
              <Typography variant="h6">
                Hello {currentUserState.userEmail}
              </Typography>
              <br />
              <TextField
                // onChange={(e) => {
                //   setEmail(e.target.value);
                // }}
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
                    // imageUrl: userDetails.imageUrl,
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
            <Button onClick={handleSaveSettingsDialog}>Save</Button>
          </DialogActions>
          <DialogActions>
            <Button onClick={handleCloseSettingsDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div class="grid-item item7">
        <Card style={{ height: "400px", borderRadius: "20px" }}>
          <MonthlyChart
            monthlyIncome={monthlyIncome}
            monthlyExpenses={monthlyExpense}
          />
        </Card>
      </div>
      <div class="grid-item item8">
        <Card
          // onClick={() => navigate("/monthlyIncome")}
          style={{
            // height: "15vh",
            minHeight: "400px",
            borderRadius: "20px", // width: "500px",
            // cursor: "pointer",
            // background: "rgb(255, 99, 132)",
            // background: "#58D68D",
            color: "black",
          }}
        >
          <Typography style={{ margin: "20px" }} variant="h6">
            Monthly Income
          </Typography>
          <Button
            style={{
              // width: "400px",
              minWidth: "300px",
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

          {monthlyData.length > 0 ? (
            <div style={{ textAlign: "start", padding: "10px" }}>
              {monthlyData
                .filter((item) => item.type === "income")
                .map((item, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#b6ff8b",
                      padding: "8px",
                      margin: "10px",
                      // width: "100%", // Occupy the full width
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
          {/* <Typography variant="h4">${monthlyIncome}</Typography> */}
        </Card>
      </div>
      <div
        class="grid-item item9"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <Card
          style={{
            // height: "100px",
            minHeight: "400px",
            borderRadius: "20px",
            // cursor: "pointer",
            // background: "rgb(54, 162, 235)",
            // background: "#fba447",
            color: "black",
          }}
        >
          <Typography style={{ margin: "20px" }} variant="h6">
            Monthly Expense
          </Typography>
          <Button
            style={{
              // width: "400px",
              minWidth: "300px",

              color: " #f377e7",
              border: "2px dotted #f377e7",
              borderRadius: "20px",
              margin: "10px",
              textTransform: "none",
            }}
            variant="outlined"
            onClick={() => navigate("/expenses")}
            // onClick={handleOpen}
          >
            + Add Expenses
          </Button>
          {/* Render the updated items */}

          {monthlyData.length > 0 ? (
            <div style={{ textAlign: "start", padding: "10px" }}>
              {monthlyData
                .filter((item) => item.type === "expense")
                .map((item, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#ffccfb",

                      padding: "8px",
                      margin: "10px",
                      // width: "100%", // Occupy the full width
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
          {/* <Typography variant="h4">${monthlyExpense}</Typography> */}
        </Card>
      </div>
      <div
        class="grid-item item10"
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Card
          // onClick={() => navigate("/expenses")}
          style={{
            minHeight: "385px",
            borderTopRightRadius: "20px",
            borderTopLeftRadius: "20px",
            color: "black",
            position: "relative",
            // zIndex: 2, // Ensure it's above the second card
          }}
        >
          {/*TODO remove this number*/}
          <Typography style={{ margin: "20px" }} variant="h6">
            Projected Annual Expense
          </Typography>

          {projectedData.projectedMonthlyData &&
          projectedData.projectedMonthlyData.length > 0 ? (
            <div style={{ textAlign: "start", padding: "10px" }}>
              {projectedData.projectedMonthlyData
                .filter((item) => item.type === "expense")
                .map((item, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#b3ecff",

                      padding: "8px",
                      margin: "10px",
                      // width: "100%", // Occupy the full width
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
        </Card>
        {/* with items ${(monthlyIncome - monthlyExpense) * 12} */}
        {/* </Typography> */}
        <div
          style={{
            // position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <Card
            style={{
              borderBottomLeftRadius: "20px", // Add border only on top
              borderBottomRightRadius: "20px",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                // marginTop: "310px",
                background: "#b3ecff",

                // borderBottomLeftRadius: "20px", // Add border only on top
                // borderBottomRightRadius: "20px",
                // borderRadius: "20px",
                // borderRadius: "20px",
              }}
            >
              Total Expense: $
              {projectedData.projectedAnnualExpense.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
            </div>
          </Card>
        </div>
      </div>
      <div
        class="grid-item item11"
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Card
          // onClick={() => navigate("/expenses")}
          style={{
            minHeight: "385px",
            borderTopRightRadius: "20px",
            borderTopLeftRadius: "20px",
            color: "black",
            position: "relative",
            // zIndex: 2, // Ensure it's above the second card
          }}
        >
          {/*TODO remove this number*/}
          <Typography style={{ margin: "20px" }} variant="h6">
            Annual Expense
          </Typography>
          {/* <Typography variant="h4"> */}
          {/* {yearlyExpense} */}
          {yearlyData.length > 0 ? (
            <div style={{ textAlign: "start", padding: "10px" }}>
              {yearlyData.map((item, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#ffccfb",

                    padding: "8px",
                    margin: "10px",
                    // width: "100%", // Occupy the full width
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
        </Card>
        <div
          style={{
            // position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <Card
            style={{
              borderBottomLeftRadius: "20px", // Add border only on top
              borderBottomRightRadius: "20px",
              background: "#ffccfb",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                // marginTop: "310px",

                // borderBottomLeftRadius: "20px", // Add border only on top
                // borderBottomRightRadius: "20px",
                // borderRadius: "20px",
                // borderRadius: "20px",
              }}
            >
              Total Expense: ${" "}
              {(yearlyExpense * 12).toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
