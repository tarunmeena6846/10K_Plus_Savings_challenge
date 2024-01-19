import React, { useEffect } from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Grid, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import CardActions from "@mui/material/CardActions";
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

  const navigate = useNavigate();

  const handleAddItem = () => {
    if (itemName && itemAmount) {
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
      await fetch(
        `${import.meta.env.VITE_SERVER_URL}/reset-monthly-expenses`,
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

  const handleSaveExpense = async () => {
    // try {
    let total = 0;

    console.log(items);
    items.forEach((item) => {
      console.log(item.amount);
      total += parseInt(item.amount);
    });
    console.log(items);

    await fetch(`${import.meta.env.VITE_SERVER_URL}/save-item`, {
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
          console.log("response data at monthlyexpense", responseData);

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
          <Card style={{ border: "4px solid #37474F", minHeight: "400px" }}>
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
          <Card style={{ border: "4px solid #37474F", minHeight: "400px" }}>
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
