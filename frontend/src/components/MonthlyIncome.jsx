import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { Grid } from "@mui/material";
import { Typography } from "@mui/material";
import { dateState } from "./store/atoms/date";
import { userState } from "./store/atoms/user";

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const years = Array.from({ length: 9 }, (_, index) => 2022 + index);

function MonthlyIncome() {
  const [items, setItems] = useState([]);
  const [selectedDate, setSelectedDate] = useRecoilState(dateState);

  const [itemName, setItemName] = useState("");
  const [itemAmount, setItemAmount] = useState("");
  const navigate = useNavigate();
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);

  console.log(new Date().getMonth());

  const handleAddItem = () => {
    if (itemName && itemAmount) {
      if (items.findIndex((item) => item.name === itemName) === -1) {
        setItems([
          ...items,
          { name: itemName, amount: parseFloat(itemAmount), type: "income" },
        ]);
        setItemName("");
        setItemAmount("");
      } else {
        const updatedItems = items.map((item) =>
          item.name === itemName
            ? {
                ...item,
                amount: item.amount + parseFloat(itemAmount),
                type: "income",
              }
            : item
        );

        setItems(updatedItems);
        setItemName("");
        setItemAmount("");
      }
    }
  };

  const handleSaveIncome = async () => {
    try {
      let total = 0;
      items.forEach((item) => {
        total += parseInt(item.amount);
      });
      console.log(items);
      await fetch(`${import.meta.env.VITE_SERVER_URL}/save-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          total,
          type: "income",
          month: selectedDate.month,
          year: selectedDate.year,
          items: items,
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
              setItems([]);
              setCurrentUserState({
                userEmail: currentUserState.userEmail,
                isLoading: false,
                imageUrl: currentUserState.imageUrl,
              });
              navigate("/dashboard");
            } else {
              console.error("Error saving Income:", responseData.error);
            }
          });
        })
        .catch((error) => {
          console.error("Error signing in email");
          setCurrentUserState({
            userEmail: null,
            isLoading: false,
            imageUrl: "",
          });
          navigate("/dashboard");
        });
    } catch (error) {
      setCurrentUserState({
        userEmail: null,
        isLoading: false,
        imageUrl: "",
      });
      console.error("Error saving income:", error.message);
      navigate("/dashboard");
    }
  };

  const handleResetMonthlyData = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_SERVER_URL}/reset-monthly-income`,
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
            console.log("response data at monthly income", responseData);

            if (responseData.success) {
              setItems([]);
              navigate("/dashboard");
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
  useEffect(() => {
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h3">Monthly Income Tracker</Typography>
      {/* <div style={{ marginTop: 16 }}>
        <Typography variant="body1" paragraph>
          Welcome to the Monthly Income Tracker. Here, you can manage your
          income for different months. Use the options below to add or delete
          income for the selected month and year.
        </Typography>
      </div> */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card style={{ border: "4px solid #37474F", minHeight: "400px" }}>
            <CardContent>
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
                onClick={handleSaveIncome}
              >
                Save Monthly Income
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                style={{ textTransform: "none" }}
                onClick={handleResetMonthlyData}
              >
                Reset Monthly Data
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card style={{ border: "4px solid #37474F", minHeight: "400px" }}>
            <CardContent>
              <div>
                <h2>Income Items:</h2>
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

export default MonthlyIncome;
