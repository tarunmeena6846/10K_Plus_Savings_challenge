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
  const [monthlyData, setMonthlyData] = useState([]);
  const [isMonthlyDataReady, setIsMonthlyDataReady] = useState(false);

  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [userDetails, setUserDetails] = useState({
    newPassword: "",
  });
  const [selectedDate, setSelectedDate] = useRecoilState(dateState);
  const [projectedUserData, setProjectedUserData] = useState(0);
  const projectedDataRef = useRef({
    projectedMonthlyData: [],
    projectedAnnualSaving: 0,
    projectedAnnualExpense: 0,
  });

  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false);
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

  const handleOpenIncomeDialog = () => {
    setIncomeDialogOpen(true);
  };

  const handleCloseIncomeDialog = () => {
    setIncomeDialogOpen(false);
  };
  console.log("selectedDate at dashboard", selectedDate);

  // console.log("process", import.meta.env.VITE_SERVER_URL);
  const handleSaveIncome = async () => {
    console.log("save income is called", monthlyIncome, monthlyExpense);

    try {
      // let total = 0;
      // items.forEach((item) => {
      //   total += parseInt(item.amount);
      // });
      // console.log(items);
      await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/save-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          // total,
          // type: "income",
          monthlyExpense: monthlyExpense,
          monthlyIncome: monthlyIncome,
          year: selectedDate.year,
          // items: items,
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
    } catch (error) {
      // setCurrentUserState({
      //   userEmail: null,
      //   isLoading: false,
      //   imageUrl: "",
      // });
      setIncomeDialogOpen(false);
      console.error("Error saving income:", error.message);
      navigate("/dashboard");
    }
  };
  const handleResetIncomeDialog = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_SERVER_URL}/admin/reset-monthly-data`,
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
                // setMonthlyIncome(0);
                // setMonthlyExpense(0);
                setIncomeDialogOpen(false);
                fetchData();
              } else {
                setIncomeDialogOpen(false);

                alert("No data for the given Month and Year");
              }
              // setItems([]);
              // navigate("/dashboard");
              //              history.go(0);
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
    } catch (error) {
      console.error("Error resetting monthly data:", error.message);
      setIncomeDialogOpen(false);
    }
    console.log("reset called");
  };
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
            (entry) => entry.month === month
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
          navigate("/projecteddashboard");
        }
        // setMonthIncExpInfo(data.items);
      } else {
        console.error("Failed to fetch monthly data");
        setMonthlyIncome(0);
        console.log("data", data);
        setProjectedUserData(0);

        setMonthlyExpense(0);
        setMonthIncExpInfo([]);
        setYearlyExpense(0);
        setYearlyIncome(0);
        navigate("/projecteddashboard");
      }

      // console.log("monthlyData", monthlyData);
    } catch (error) {
      console.error("Error fetching monthly data:", error);
      setMonthlyIncome(0);
      setMonthlyExpense(0);
      setMonthIncExpInfo([]);
      setYearlyExpense(0);
      setYearlyIncome(0);
    }
  };

  useEffect(() => {
    // // Fetch monthly data from the backend
    // const fetchData = async () => {
    //   try {
    //     console.log("selectedDate", selectedDate);
    //     const token = localStorage.getItem("token"); // Get the token from your authentication process
    //     const response = await fetch(
    //       `${import.meta.env.VITE_SERVER_URL}/admin/get-list/${
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
    //           (entry) => entry.month === month
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
    //         navigate("/projecteddashboard");
    //       }
    //       // setMonthIncExpInfo(data.items);
    //     } else {
    //       console.error("Failed to fetch monthly data");
    //       setMonthlyIncome(0);
    //       console.log("data", data);
    //       setProjectedUserData(0);

    //       setMonthlyExpense(0);
    //       setMonthIncExpInfo([]);
    //       setYearlyExpense(0);
    //       setYearlyIncome(0);
    //       navigate("/projecteddashboard");
    //     }

    //     // console.log("monthlyData", monthlyData);
    //   } catch (error) {
    //     console.error("Error fetching monthly data:", error);
    //     setMonthlyIncome(0);
    //     setMonthlyExpense(0);
    //     setMonthIncExpInfo([]);
    //     setYearlyExpense(0);
    //     setYearlyIncome(0);
    //   }
    // };

    fetchData();
  }, [
    selectedDate.month,
    selectedDate.year,
    // currentUserState.userEmail,
    // currentUserState.isLoading,
    // navigate,
    setCurrentUserState,
    // setMonthlyIncome,
    // setMonthlyExpense,
    // setIncomeDialogOpen,
  ]); // Run this effect only once when the component mounts

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

  // useEffect(() => {
  //   console.log(
  //     "selectedDate default",
  //     new Date().getFullYear(),
  //     selectedDate.year
  //   );
  //   if (
  //     selectedDate.year &&
  //     selectedDate.year !== new Date().getFullYear() // Replace YOUR_DEFAULT_YEAR with the default year value
  //   ) {
  //     navigate("/projecteddashboard");
  //     // setSelectedDate({
  //     //   year: selectedDate.year,
  //     //   month: selectedDate.month,
  //     // });
  //   }
  //   // Check if the necessary data is available before navigating
  //   // if (currentUserState.userEmail === null && !currentUserState.isLoading) {
  //   // navigate("/projecteddashboard");
  //   // handleYearChange();

  //   // }
  // }, [
  //   selectedDate.year,
  //   // currentUserState.userEmail,
  //   // currentUserState.isLoading,
  //   // navigate,
  //   // setCurrentUserState,
  // ]);
  // console.log("monthlyData", monthlyData);
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
              {(projectedUserData * 12).toLocaleString("en-US", {
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
          }}
        >
          <CardContent>
            <Typography variant="body1"> Projected Monthly Savings </Typography>
            <Typography variant="h4">
              $
              {projectedUserData.toLocaleString("en-US", {
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
            <Typography variant="body1"> Actual Monthly Savings</Typography>
            <Typography variant="h4">
              $
              {(monthlyIncome - monthlyExpense).toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
            </Typography>
          </CardContent>
        </Card>
      </div>
      <div class="grid-item item5">
        {/* <Card
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
        </Card> */}
      </div>
      <div class="grid-item item6">
        <Card style={{ minHeight: "400px", borderRadius: "20px" }}>
          {isMonthlyDataReady && <MonthlyBarGraph monthlyData={monthlyData} />}
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
          {/* Render the updated items */}
          <Dialog
            open={incomeDialogOpen}
            onClose={handleCloseIncomeDialog}
            aria-labelledby="income-dialog-title"
          >
            <DialogTitle id="income-dialog-title"></DialogTitle>
            <DialogContent>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                {/* <UserAvatar
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
                <br /> */}
                <TextField
                  label="Monthly Income"
                  variant="outlined"
                  type="Number"
                  fullWidth
                  value={monthlyIncome}
                  onChange={(e) => {
                    setMonthlyIncome(
                      e.target.value
                      // // (prevMonthlyIncome) =>
                      //   prevMonthlyIncome + parseInt(e.target.value)
                    );
                  }}
                />
                <br />
                <br />
                <TextField
                  onChange={(e) => {
                    setMonthlyExpense(
                      // (prevMonthlyExpense) =>
                      // prevMonthlyExpense + parseInt(e.target.value)
                      e.target.value
                    );
                  }}
                  label="Monthly Expense"
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
              <Button onClick={handleSaveIncome}>Save</Button>
            </DialogActions>
            <DialogActions>
              <Button onClick={handleResetIncomeDialog}>Reset</Button>
            </DialogActions>
            <DialogActions>
              <Button onClick={handleCloseIncomeDialog}>Close</Button>
            </DialogActions>
          </Dialog>
          <div>
            <Typography variant="h4" style={{ paddingTop: "20px" }}>
              Monthy Income
            </Typography>
            <Typography variant="h5">{`$${monthlyIncome}`}</Typography>
            <Typography variant="h4" style={{ paddingTop: "50px" }}>
              Monthly Expenses
            </Typography>
            <Typography variant="h5">{`$${monthlyExpense}`}</Typography>
          </div>

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
            + Income & Expense
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
        </Card>
      </div>
      {/* <div
        class="grid-item item9"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <Card
          style={{
            minHeight: "400px",
            borderRadius: "20px",
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
      </div> */}
      {/* <div
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
      </div> */}
      {/* <div
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
      </div> */}
    </div>
  );
}

export default Dashboard;
