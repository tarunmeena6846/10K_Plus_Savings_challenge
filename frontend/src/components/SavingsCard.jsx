import React, { useState } from "react";
import { Button, Card, TextField, Typography } from "@mui/material";
import "./SavingsCard.css"; // Import your CSS for transition
import { useNavigate } from "react-router-dom";
import { dateState } from "./store/atoms/date";
import { useRecoilState } from "recoil";

const SavingsCard = () => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [savings, setSavings] = useState(0);
  const [selectedDate, setSelectedDate] = useRecoilState(dateState);

  const [cardType, setCardType] = useState("income");
  const navigate = useNavigate();
  // const currentDate = new Date();
  console.log("selectedDate at savingcard", selectedDate.year);

  const handleContinue = async () => {
    await fetch(
      `${import.meta.env.VITE_SERVER_URL}/admin/update-projected-savings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          projectedYearlySavings: income - expense,
          // year: currentDate.getFullYear(),
          year: selectedDate.year,
        }),
      }
    )
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Network response is not ok");
        }
        resp.json().then((responseData) => {
          console.log("response data at update projeted savings", responseData);

          // setCourses(data);
          if (responseData.success == true) {
            // Clear items array after saving
            // setMonthlyExpense(responseData.totalExpenses);
            navigate("/dashboard");
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
  const handleSave = async (value) => {
    console.log("value", value);
    if (cardType === "income") {
      setIncome(Number(value));
      setCardType("expense");
    } else if (cardType === "expense") {
      setExpense(Number(value));
      setCardType("savings");
      console.log(income, value);
      setSavings(income - Number(value));
    }
  };

  return (
    <div>
      {cardType === "income" && (
        <Card
          className={`transition-card visible ${cardType}`}
          variant="outlined"
          style={{
            width: 400,
            minHeight: "350px",
            padding: 20,
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "15px",
            }}
          >
            <Typography variant="h4">Monthly Income</Typography>
          </div>
          <TextField
            onChange={(e) => setIncome(e.target.value)}
            variant="outlined"
            fullWidth
            multiline
            rows={6} // Adjust the number of rows as needed
            label="Enter Income"
            InputLabelProps={{ shrink: true }}
            style={{ marginTop: "5px" }}
          />
          <div>
            <Button
              variant="outlined"
              style={{ background: "pink", marginTop: "20px" }}
              onClick={() => handleSave(income)}
            >
              Save
            </Button>
          </div>
        </Card>
      )}

      {cardType === "expense" && (
        <Card
          className={`transition-card visible ${cardType}`}
          variant="outlined"
          style={{
            width: 400,
            minHeight: "350px",
            padding: 20,
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4">Monthly Expense</Typography>
          <TextField
            onChange={(e) => setExpense(e.target.value)}
            variant="outlined"
            fullWidth
            // multiline // Add this line to allow multiline input
            // rows={6} // Adjust the number of rows as needed
            label="Enter Expense"
            InputLabelProps={{ shrink: true }}
            style={{ marginTop: "5px" }}
            type="number" // Restrict input to numbers
          />
          <div>
            <Button
              variant="outlined"
              style={{ background: "pink", marginTop: "20px" }}
              onClick={() => handleSave(expense)}
            >
              Save
            </Button>
          </div>
        </Card>
      )}

      {cardType === "savings" && (
        <Card
          className={`transition-card visible ${cardType}`}
          variant="outlined"
          style={{
            width: 400,
            minHeight: "350px",
            padding: 20,
            borderRadius: "20px",
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Typography variant="h4" style={{ paddingTop: "10px" }}>
              Projected Savings
            </Typography>
            <Typography variant="h5">{`$${savings * 12}`}</Typography>
            <Typography variant="h4" style={{ paddingTop: "100px" }}>
              Monthly Savings
            </Typography>
            <Typography variant="h5">{`$${savings}`}</Typography>
          </div>
          <div>
            <Button
              variant="outlined"
              style={{ marginTop: "20px" }}
              onClick={handleContinue}
            >
              Continue
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SavingsCard;
