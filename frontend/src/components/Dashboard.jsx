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
  const [monthlyIncome, setMonthlyIncome] = useRecoilState(monthlyIncomeState);
  const [monthlyExpense, setMonthlyExpense] =
    useRecoilState(monthlyExpenseState);
  const [yearlyIncome, setYearlyIncome] = useState(0);
  const [yearlyExpense, setYearlyExpense] = useState(0);
  const [monthIncExpInfo, setMonthIncExpInfo] = useState([]); // holds the monthly income and expense info along with the items
  const [yearlyData, setYearlyData] = useState([]);
  const [monthlyItems, setMonthlyItems] = useState([]);

  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [userDetails, setUserDetails] = useState({
    newPassword: "",
  });
  const [selectedDate, setSelectedDate] = useRecoilState(dateState);
  // const [projectedDataRef.current, setprojectedDataRef.current] = useState({
  //   projectedMonthlyData: [],
  //   projectedAnnualSaving: 0,
  //   projectedAnnualExpense: 0,
  // });
  const projectedDataRef = useRef({
    projectedMonthlyData: [],
    projectedAnnualSaving: 0,
    projectedAnnualExpense: 0,
  });

  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const handleReset = () => {
    setCurrentUserState({
      userEmail: currentUserState.userEmail,
      isLoading: currentUserState.isLoading,
      imageUrl: "",
    });
  };
  const handleOpenSettingsDialog = () => {
    setSettingsDialogOpen(true);
  };

  const handleCloseSettingsDialog = () => {
    setSettingsDialogOpen(false);
  };
  // console.log("process", import.meta.env.VITE_SERVER_URL);

  const handleSaveSettingsDialog = async () => {
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/admin/change-user_details`,
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

      console.log(data);
      setSettingsDialogOpen(false);
    } catch (error) {
      alert("Error Changing email");
      console.error("Error signing in email");
    }
  };

  const handleImageChange = (imageUrl) => {
    setUserDetails({
      newPassword: userDetails.newPassword,
    });
  };

  useEffect(() => {
    // Fetch monthly data from the backend
    const fetchData = async () => {
      try {
        console.log("selectedDate", selectedDate);
        const token = localStorage.getItem("token"); // Get the token from your authentication process
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/admin/get-list/${
            selectedDate.year
          }/${selectedDate.month}`,
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
          setMonthIncExpInfo(data.items);
          setMonthlyIncome(data.totalIncome);
          setMonthlyExpense(data.totalExpenses);

          if (selectedDate.month === "January") {
            console.log("tarun insdie month jan");
            // projectedDataRef.current = {
            //   projectedMonthlyData: data.items,
            //   projectedAnnualSaving:
            //     (data.totalIncome - data.totalExpenses) * 12,
            //   projectedAnnualExpense: data.totalExpenses * 12,
            // };
          }
          console.log("projected data ", projectedDataRef);
        } else {
          console.error("Failed to fetch monthly data");
          setMonthlyIncome(0);
          setMonthlyExpense(0);
          setMonthIncExpInfo([]);
          // projectedDataRef.current = {
          //   projectedMonthlyData: projectedDataRef.current.projectedMonthlyData,
          //   projectedAnnualSaving:
          //     projectedDataRef.current.projectedAnnualSaving,
          //   projectedAnnualExpense:
          //     projectedDataRef.current.projectedAnnualExpense,
          // };
        }
      } catch (error) {
        console.error("Error fetching monthly data:", error);
        setMonthlyIncome(0);
        setMonthlyExpense(0);
        setMonthIncExpInfo([]);
      }
    };

    fetchData();
  }, [
    selectedDate.month,
    selectedDate.year,
    currentUserState.userEmail,
    currentUserState.isLoading,
    // navigate,
    setCurrentUserState,
    setMonthlyIncome,
  ]); // Run this effect only once when the component mounts

  useEffect(() => {
    // Fetch monthly data from the backend
    const fetchYearlyData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(selectedDate.year); // Get the token from your authentication process
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/admin/get-yearly-list/${
            selectedDate.year
          }`,
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

          projectedDataRef.current = {
            projectedMonthlyData: data.janItems,
            projectedAnnualSaving:
              (data.items[0].income - data.items[0].expenses) * 12,
            projectedAnnualExpense: data.items[0].expenses * 12,
          };
        } else {
          console.error("Failed to fetch yearly data");
        }
      } catch (error) {
        console.error("Error fetching yearly data:", error);
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

  // const { current: projectedData } = projectedDataRef;
  // // Accessing values from projectedData
  // const projectedMonthlyData = projectedData.projectedMonthlyData;
  // const projectedAnnualSaving = projectedData.projectedAnnualSaving;
  // const projectedAnnualExpense = projectedData.projectedAnnualExpense;

  // // You can use these values as needed in your component
  // console.log("Projected Monthly Data:", projectedMonthlyData);
  // console.log("Projected Annual Saving:", projectedAnnualSaving);
  // console.log("Projected Annual Expense:", projectedAnnualExpense);
  return (
    <div class="grid-container" style={{ margin: "20px" }}>
      <div
        class="grid-item item1"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "70px",
          }}
        >
          <Typography variant="h5">Welcome Back</Typography>
          <Typography variant="h4">{currentUserState.userEmail}</Typography>
        </div>
      </div>
      <div class="grid-item item2 " style={{ marginTop: "0px" }}>
        <Card style={{ borderRadius: "20px", background: "#e3c0ff" }}>
          <CardContent>
            <Typography variant="body1"> Projected Annual Savings </Typography>
            <Typography variant="h4">
              $
              {projectedDataRef.current.projectedAnnualSaving.toLocaleString(
                "en-US",
                {
                  maximumFractionDigits: 2,
                }
              )}
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
        <Card style={{ minHeight: "400px", borderRadius: "20px" }}>
          <MonthlyBarGraph monthlyData={monthlyItems} />
        </Card>
      </div>
      <div class="grid-item item12">
        <Card
          style={{
            minHeight: "400px",
            borderRadius: "20px", // width: "500px",
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
                // onImageChange={handleImageChange}
              />
              <br />
              <Button style={{ textTransform: "none" }} onClick={handleReset}>
                Reset Image
              </Button>
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
          style={{
            minHeight: "400px",
            borderRadius: "20px", // width: "500px",
            color: "black",
          }}
        >
          <Typography style={{ margin: "20px" }} variant="h6">
            Monthly Income
          </Typography>
          <Button
            style={{
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
              minWidth: "300px",
              color: " #f377e7",
              border: "2px dotted #f377e7",
              borderRadius: "20px",
              margin: "10px",
              textTransform: "none",
            }}
            variant="outlined"
            onClick={() => navigate("/expenses")}
          >
            + Add Expenses
          </Button>
          {/* Render the updated items */}

          {monthIncExpInfo.length > 0 ? (
            <div style={{ textAlign: "start", padding: "10px" }}>
              {monthIncExpInfo
                .filter((item) => item.type === "expense")
                .map((item, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#ffccfb",

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
          style={{
            minHeight: "385px",
            borderTopRightRadius: "20px",
            borderTopLeftRadius: "20px",
            color: "black",
            position: "relative",
          }}
        >
          <Typography style={{ margin: "20px" }} variant="h6">
            Projected Annual Expense
          </Typography>

          {projectedDataRef.current.projectedMonthlyData &&
          projectedDataRef.current.projectedMonthlyData.length > 0 ? (
            <div style={{ textAlign: "start", padding: "10px" }}>
              {projectedDataRef.current.projectedMonthlyData
                .filter((item) => item.type === "expense")
                .map((item, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#b3ecff",

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
                      {(item.amount * 12).toLocaleString("en-US", {
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
                background: "#b3ecff",
              }}
            >
              Total Expense: $
              {projectedDataRef.current.projectedAnnualExpense.toLocaleString(
                "en-US",
                {
                  maximumFractionDigits: 2,
                }
              )}
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
          style={{
            minHeight: "385px",
            borderTopRightRadius: "20px",
            borderTopLeftRadius: "20px",
            color: "black",
            position: "relative",
          }}
        >
          <Typography style={{ margin: "20px" }} variant="h6">
            Annual Expense
          </Typography>

          {yearlyData.length > 0 ? (
            <div style={{ textAlign: "start", padding: "10px" }}>
              {yearlyData.map((item, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#ffccfb",

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
                    {(item.amount * 12).toLocaleString("en-US", {
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
