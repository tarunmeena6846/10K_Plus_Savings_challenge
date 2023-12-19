// import { CardHeader, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Grid, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { monthlyExpenseState } from "./store/atoms/total";
import { useRecoilState } from "recoil";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CardActions from "@mui/material/CardActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { dateState } from "./store/atoms/date";
import { userState } from "./store/atoms/user";

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function MonthlyExpenses() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemAmount, setItemAmount] = useState("");
  const [selectedDate, setSelectedDate] = useRecoilState(dateState);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);

  // const [selectedMonth, setSelectedMonth] = useState(
  //   months[new Date().getMonth()]
  // );
  // const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const navigate = useNavigate();
  // const [totalExpenses, setTotalExpenses] = useRecoilState(totalState);
  const [monthlyExpense, setMonthlyExpense] =
    useRecoilState(monthlyExpenseState);

  // const itemArray = [];

  const handleAddItem = () => {
    // console.log("tarun at items", items);
    if (itemName && itemAmount) {
      // if (!items.some((existingItem) => existingItem.item === itemName)) {
      //   setItems([...items, { item: itemName, amount: itemAmount }]);
      // }
      if (items.findIndex((item) => item.name === itemName) === -1) {
        setItems([
          ...items,
          { name: itemName, amount: parseFloat(itemAmount), type: "expense" },
        ]);

        setItemName("");
        setItemAmount("");
      } else {
        const updatedItems = items.map((item) =>
          item.name === itemName
            ? {
                ...item,
                amount: item.amount + parseFloat(itemAmount),
                type: "expense",
              }
            : item
        );

        setItems(updatedItems);
        setItemName("");
        setItemAmount("");
      }
    }
  };

  const handleResetMonthlyData = async () => {
    try {
      await fetch("http://localhost:3000/admin/reset-monthly-expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          month: selectedDate.month,
          year: selectedDate.year,
        }),
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error("Network response is not ok");
          }
          resp.json().then((responseData) => {
            console.log("tarun", responseData);

            if (responseData.success) {
              console.log("tarun inside success");
              setItems([]);
              navigate("/dashboard");
              //              history.go(0);
            } else {
              console.error(
                "Error resetting monthly data:",
                responseData.error
              );
            }
          });
        })
        .catch((error) => {
          console.error("Error resetting monthly data:", error.message);
        });
    } catch (error) {
      console.error("Error resetting monthly data:", error.message);
    }
  };

  // console.log("tarun utems ", items);
  const handleSaveExpense = async () => {
    console.log("tarun at handlesaveexpses");
    // try {
    let total = 0;

    console.log(items);
    items.forEach((item) => {
      console.log(item.amount);
      total += parseInt(item.amount);
    });
    console.log(items);

    console.log("tarun total is ", total);
    await fetch("http://localhost:3000/admin/save-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        total,
        type: "expense",
        month: selectedDate.month,
        year: selectedDate.year,
        items,
      }),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Network response is not ok");
        }
        resp.json().then((responseData) => {
          console.log("tarun", responseData);
          console.log("tarun", responseData.totalExpenses);

          // setCourses(data);
          if (responseData.success == true) {
            // Clear items array after saving
            setItems([]);
            // setMonthlyExpense(responseData.totalExpenses);
            navigate("/dashboard");
            setCurrentUserState({
              userEmail: currentUserState.userEmail,
              isLoading: false,
              imageUrl: currentUserState.imageUrl,
            });
            // console.log(total);
            // localStorage.setItem(
            //   "monthlyExpense",
            //   JSON.stringify(responseData.totalExpenses)
            // );

            console.log("tarun after setting the items to null");
            // itemArray.clear();
          } else {
            setCurrentUserState({
              userEmail: null,
              isLoading: false,
              imageUrl: "",
            });
            console.error("Error saving expense:", responseData.error);
          }
        });
      })
      .catch((error) => {
        setCurrentUserState({
          userEmail: null,
          isLoading: false,
          imageUrl: "",
        });
        console.error("Error signing in email");
      });
  };
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
  // Array of months and years
  const years = Array.from({ length: 9 }, (_, index) => 2022 + index);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        // backgroundColor: "#F0F0F0",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h3">Monthly Expense Tracker</Typography>
      <div style={{ marginTop: 16 }}>
        <Typography variant="body1" paragraph>
          Welcome to the Monthly Expenses Tracker. Here, you can manage your
          expenses for different months. Use the options below to add or delete
          expenses for the selected month and year.
        </Typography>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card style={{ border: "4px solid #37474F", height: "60vh" }}>
            <CardContent>
              {/* <h1>Monthly Income Tracker</h1> */}
              <div>
                <TextField
                  label="Item"
                  variant="outlined"
                  value={itemName}
                  required
                  fullWidth
                  onChange={(e) => setItemName(e.target.value)}
                />
                <br />
                <br />
                <TextField
                  label="Amount"
                  variant="outlined"
                  value={itemAmount}
                  required
                  fullWidth
                  type="number"
                  onChange={(e) => setItemAmount(e.target.value)}
                />
                <br />
                <br />
                {/* <FormControl variant="outlined">
                  <InputLabel>Select Month</InputLabel>
                  <Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    label="Select Month"
                  >
                    {months.map((month) => (
                      <MenuItem key={month} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl variant="outlined">
                  <InputLabel>Select Year</InputLabel>
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    label="Select Year"
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
                <br />
                <br />
                <Button
                  variant="outlined"
                  style={{ textTransform: "none" }}
                  onClick={handleAddItem}
                >
                  + Add Item
                </Button>
              </div>
            </CardContent>
            <CardActions style={{ justifyContent: "center" }}>
              <Button
                // variant="contained"
                style={{ textTransform: "none" }}
                variant="outlined"
                onClick={handleSaveExpense}
              >
                Save Monthly Expenses
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                style={{ textTransform: "none" }}
                onClick={handleResetMonthlyData}
              >
                Reset Monthly Expenses
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card style={{ border: "4px solid #37474F", minHeight: "60vh" }}>
            <CardContent>
              <div>
                <Typography variant="h4">Expense Items:</Typography>
                <List>
                  {items.map((item, index) => (
                    <ListItem key={index} style={{ color: "purple" }}>
                      <ListItemText primary={`${item.name}: $${item.amount}`} />
                    </ListItem>
                  ))}
                </List>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default MonthlyExpenses;
