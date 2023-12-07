import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { monthlyIncomeState } from "./store/atoms/total";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { Grid } from "@mui/material";
import { Typography } from "@mui/material";
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

function MonthlyIncome() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemAmount, setItemAmount] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();
  const [monthlyIncome, setMonthlyIncome] = useRecoilState(monthlyIncomeState);

  console.log(new Date().getMonth());

  const handleAddItem = () => {
    if (itemName && itemAmount) {
      if (items.findIndex((item) => item.name === itemName) === -1) {
        setItems([...items, { item: itemName, amount: itemAmount }]);
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

      await fetch("http://localhost:3000/admin/save-income", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          total,
          month: selectedMonth,
          year: selectedYear,
        }),
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error("Network response is not ok");
          }
          resp.json().then((responseData) => {
            console.log("tarun", responseData);
            console.log("tarun", responseData.totalIncome);

            if (responseData.success) {
              console.log("tarun inside success");
              setItems([]);
              // setMonthlyIncome(responseData.totalIncome);
              window.location = "/dashboard";
            } else {
              console.error("Error saving Income:", responseData.error);
            }
          });
        })
        .catch((error) => {
          console.error("Error signing in email");
        });
    } catch (error) {
      console.error("Error saving income:", error.message);
    }
  };

  const handleResetMonthlyData = async () => {
    try {
      await fetch("http://localhost:3000/admin/reset-monthly-income", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          month: selectedMonth,
          year: selectedYear,
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
              window.location = "/dashboard";
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

  const years = Array.from({ length: 9 }, (_, index) => 2022 + index);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "#F0F0F0",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h3">Monthly Income Tracker</Typography>
       <div style={{ marginTop: 16 }}>
        <Typography variant="body1" paragraph>
          Welcome to the Monthly Income Tracker. Here, you can manage your income
          for different months. Use the options below to add or delete income for
          the selected month and year.
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
                <FormControl variant="outlined">
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
                </FormControl>
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
          <Card style={{ border: "4px solid #37474F", minHeight: "60vh" }}>
            <CardContent>
              <div>
                <h2>Income Items:</h2>
                <List>
                  {items.map((item, index) => (
                    <ListItem key={index} style={{ color: "purple" }}>
                      <ListItemText primary={`${item.item}: $${item.amount}`} />
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
