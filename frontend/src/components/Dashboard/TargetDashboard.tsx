import React, { useEffect, useState } from "react";
import SidebarLayout from "../SidebarLayout";
import { monthIncExpInfo } from "../Dashboard";
import { Button } from "@mui/material";
import AddTransactionModal from "./InputModel";
import { handleAddIncome, handleAddExpense } from "./AddIncomeAndExpense";
import { fetchData } from "./fetchIncomeAndExpenseData";

export default function TargetDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // State to track active tab in modal
  const [targetItemList, setTargetItemList] = useState([]);
  const [targetIncome, setTargetIncome] = useState(0);
  const [targetExpense, setTargetExpense] = useState(0);
  const openModal = (tab) => {
    setActiveTab(tab);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const fetchDataAsync = async () => {
      const targetData = await fetchData(
        new Date().getFullYear(),
        new Date().toLocaleString("default", { month: "long" }),
        "Target"
      );
      if (targetData.success) {
        setTargetIncome(targetData.targetData.income);
        setTargetExpense(targetData.targetData.expense);
        setTargetItemList(targetData.targetData.items);
      }
    };
    fetchDataAsync();
  }, []); // Run this effect only once when the component mounts

  // const handleAddIncome = () => {
  //   // Add logic to handle adding income
  //   console.log("Add income logic here");
  // };

  // const handleAddExpense = () => {
  //   // Add logic to handle adding expense
  //   console.log("Add expense logic here");
  // };
  return (
    <div>
      <SidebarLayout>
        <div className="grid grid-cols-1 md:grid-rows-3 md:grid-cols-3 gap-4">
          <div
            className="p-6 rounded-2xl"
            style={{
              background: "#ffcbfb",
            }}
          >
            <h2>Target Income</h2>
            <h2 className="text-4xl">${targetIncome}</h2>
          </div>
          <div
            className="p-6 rounded-2xl"
            style={{
              background: "#b2edff",
              overflow: "scroll",
            }}
          >
            <h2>Target Expenses</h2>
            <h2 className="text-4xl">${targetExpense}</h2>
          </div>
          <div
            className="p-6 rounded-2xl"
            style={{
              background: "#ceffae",
              overflowX: "auto",
            }}
          >
            <h2>Target Savings</h2>
            <h2 className="text-4xl">${targetIncome - targetExpense}</h2>
          </div>
          <div className="md:col-span-3 grid grid-cols-4 row-span-2 gap-4">
            <div
              className="pt-6 md:col-span-2 flex flex-col items-center rounded-2xl "
              style={{ background: "white", overflow: "hidden" }}
            >
              <h2 className="mb-4 text-center">Target Income</h2>
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
              {targetItemList.length > 0 ? (
                <div
                  style={{
                    padding: "10px",
                    width: "100%",
                  }}
                >
                  {targetItemList
                    .filter((item) => item.type === "Income")
                    .slice(0, 5)
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
              ) : (
                <>No records to show</>
              )}
            </div>

            <div
              className="pt-6 md:col-span-2 flex flex-col items-center rounded-2xl"
              style={{ background: "white", overflow: "hidden" }}
            >
              <h2 className="mb-4 text-center">Target Expenses</h2>
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
              {targetItemList.length > 0 ? (
                <div style={{ padding: "10px", width: "100%" }}>
                  {targetItemList
                    .filter((item) => item.type === "Expense")
                    .slice(0, 5)
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
              ) : (
                <>No records to show</>
              )}
            </div>
          </div>
        </div>
      </SidebarLayout>
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddIncome={handleAddIncome}
        onAddExpense={handleAddExpense}
        activeTab={activeTab}
        type="Target" // Pass active tab to the modal
      />
    </div>
  );
}
