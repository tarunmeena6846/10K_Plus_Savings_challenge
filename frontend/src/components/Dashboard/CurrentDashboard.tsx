import React, { useEffect, useState } from "react";
import SidebarLayout from "../SidebarLayout";
import { Button } from "@mui/material";
// import { monthIncExpInfo } from "../Dashboard";
import AddTransactionModal from "./InputModel";
import { handleAddIncome, handleAddExpense } from "./AddIncomeAndExpense";
import { fetchData } from "./fetchIncomeAndExpenseData";
export default function CurrentDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // State to track active tab in modal
  const [currentItemList, setCurrentItemList] = useState([]);
  const [currentIncome, setCurrentIncome] = useState(0);
  const [currentExpense, setCurrentExpense] = useState(0);
  const openModal = (tab) => {
    setActiveTab(tab);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // //Fetch monthly data from the backend
  // const fetchData = async (year: Number, month?: String, type?: String) => {
  //   try {
  //     // console.log("selectedDate", selectedDate);
  //     const token = localStorage.getItem("token"); // Get the token from your authentication process
  //     const date = new Date();
  //     const response = await fetch(
  //       `${
  //         import.meta.env.VITE_SERVER_URL
  //       }/data/get-list/${date.getFullYear()}/${date.toLocaleString("default", {
  //         month: "long",
  //       })}`,
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
  //       // setMonthlyIncome(0);
  //       // // setMonthlyExpense(0);
  //       // console.log("inside");
  //       // // setYearlyExpense(data.yearlyEntry.totalExpenses);
  //       // setYearlyIncome(data.yearlyEntry.totalIncome);
  //       // setProjectedUserData(data.yearlyEntry.projectedYearlySavings);
  //       // console.log("yearly entry:", data.yearlyEntry.monthlyData);
  //       // const allMonthsData = months.map((month) => {
  //       //   console.log("month", month);
  //       //   const existingEntry = data.yearlyEntry.monthlyData.find(
  //       //     (entry: { month: String }) => entry.month === month
  //       //   );
  //       //   if (existingEntry) {
  //       //     const actualSavings =
  //       //       existingEntry.monthlyIncome - existingEntry.monthlyExpenses;
  //       //     return {
  //       //       month,
  //       //       actualSavings,
  //       //       projectedSaving: data.yearlyEntry.projectedYearlySavings,
  //       //     };
  //       //   } else {
  //       //     return {
  //       //       month,
  //       //       actualSavings: 0,
  //       //       projectedSaving: data.yearlyEntry.projectedYearlySavings,
  //       //     };
  //       //   }
  //       // });
  //       // console.log("allmonthdata", allMonthsData);
  //       // setMonthlyData(allMonthsData);
  //       // if (data.monthlyEntry) {
  //       //   setMonthlyIncome(data.monthlyEntry.monthlyIncome);
  //       //   setMonthlyExpense(data.monthlyEntry.monthlyExpenses);
  //       // }
  //       // // return <MonthlyBarGraph allMonthsData={allMonthsData} />;
  //       // setIsMonthlyDataReady(true); // Set the flag to true when data is ready
  //       // if (data.yearlyEntry.projectedYearlySavings === 0) {
  //       //   // navigate("/projecteddashboard");
  //       // }
  //       // setMonthIncExpInfo(data.items);
  //     } else {
  //       // console.error("Failed to fetch monthly data");
  //       // setMonthlyIncome(0);
  //       // console.log("data", data);
  //       // setProjectedUserData(0);
  //       // setMonthlyExpense(0);
  //       // setYearlyExpense(0);
  //       // setYearlyIncome(0);
  //       // navigate("/projecteddashboard");
  //     }

  //     // console.log("monthlyData", monthlyData);
  //   } catch (error) {
  //     console.error("Error fetching monthly data:", error);
  //     // setMonthlyIncome(0);
  //     // setMonthlyExpense(0);
  //     // setYearlyExpense(0);
  //     // setYearlyIncome(0);
  //   }
  // };

  useEffect(() => {
    const fetchDataAsync = async () => {
      const currentData = await fetchData(
        new Date().getFullYear(),
        new Date().toLocaleString("default", { month: "long" }),
        "current"
      );
      console.log("currentData", currentData);
      if (currentData.success) {
        console.log(currentData.success);
        setCurrentIncome(currentData.currentData.income);
        setCurrentExpense(currentData.currentData.expense);
        setCurrentItemList(currentData.currentData.items);
      }
    };
    fetchDataAsync();
  }, []); // Run this effect only once when the component mounts

  return (
    <div>
      <SidebarLayout>
        <div className="grid grid-cols-1 md:grid-rows-3 md:grid-cols-3 gap-4">
          <div
            className="p-6 rounded-2xl"
            style={{ background: "#ffcbfb", overflow: "hidden" }}
          >
            <h2>Current Income</h2>
            <h2 className="text-4xl">${currentIncome}</h2>
          </div>
          <div
            className="p-6 rounded-2xl"
            style={{ background: "#b2edff", overflow: "hidden" }}
          >
            <h2>Current Expense</h2>
            <h2 className="text-4xl">${currentExpense}</h2>
          </div>
          <div
            className="p-6 rounded-2xl"
            style={{ background: "#ceffae", overflow: "hidden" }}
          >
            <h2>Current Savings</h2>
            <h2 className="text-4xl">${currentIncome - currentExpense}</h2>
          </div>
          <div className="md:col-span-3 grid grid-cols-4 row-span-2 gap-4">
            <div
              className="pt-6 md:col-span-2 flex flex-col items-center rounded-2xl"
              style={{ background: "white", overflow: "hidden" }}
            >
              <h2 className="mb-4 text-center">Current Income</h2>
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
                onClick={() => openModal(0)} // Open modal when button is clicked
              >
                + Add Income
              </Button>
              {/* Render the updated items */}
              {currentItemList.length > 0 ? (
                <div style={{ padding: "10px", width: "100%" }}>
                  {currentItemList
                    .filter((item) => item.type === "Income")
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
                        <span style={{ flex: 1 }}>{item.title}</span>
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
              className="pt-6 md:col-span-2 flex flex-col items-center rounded-2xl"
              style={{ background: "white", overflow: "hidden" }}
            >
              <h2 className="mb-4 text-center">Current Expenses</h2>
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
                onClick={() => openModal(1)} // Open modal when button is clicked
              >
                + Add Expenses
              </Button>
              {/* Render the updated items */}
              {currentItemList.length > 0 ? (
                <div style={{ padding: "10px", width: "100%" }}>
                  {currentItemList
                    .filter((item) => item.type === "Expense")
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
                        <span style={{ flex: 1 }}>{item.title}</span>
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
          </div>
        </div>
      </SidebarLayout>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddIncome={handleAddIncome}
        onAddExpense={handleAddExpense}
        activeTab={activeTab} // Pass active tab to the modal
        type="current"
      />
    </div>
  );
}
