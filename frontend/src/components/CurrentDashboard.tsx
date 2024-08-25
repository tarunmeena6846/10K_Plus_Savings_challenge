import React, { useEffect, useState } from "react";
import SidebarLayout from "./SidebarLayout";
import { Button } from "@mui/material";
import AddTransactionModal from "./Dashboard/InputModel";
import {
  handleAddIncome,
  handleAddExpense,
} from "./Dashboard/AddIncomeAndExpense";
import { fetchData } from "./Dashboard/fetchIncomeAndExpenseData";
import { useRecoilState } from "recoil";
import { actionsState, userState } from "./store/atoms/user";
import Loader from "./community/Loader";
import { DropDownButton } from "./DropDown/button";

import IncomeGraph from "./SpendingBarGraph";
import LineGraph from "./LineGraph";

function getIconForCategory(category) {
  // Define your category-to-icon mapping here
  const icons = {
    "Health and Fitness": "./health.svg",
    "Debt Repayment": "./debt.svg",
    "Savings and Investments": "./saving.svg",
    Housing: "./houseing.svg",
    Entertainment: "./entertainment.svg",
    Food: "./food.svg",
    
    // Add more categories and their corresponding icons
  };
  return icons[category] || "./expense.svg"; // Default icon if the category is not found
}

export default function CurrentDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  console.log(currentUserState);
  // setCurrentUserState((prev) => ({
  //   ...prev,
  //   isLoading: false,
  // }));
  const [activeTab, setActiveTab] = useState(0); // State to track active tab in modal
  const [currentItemList, setCurrentItemList] = useState([]);
  const [currentIncome, setCurrentIncome] = useState(0);
  const [currentExpense, setCurrentExpense] = useState(0);
  const [action, setActions] = useRecoilState(actionsState);
  const [categoryWiseSpendings, setCategoryWiseSpendings] = useState([]);
  const [categoryWiseIncome, setCategoryWiseIncome] = useState([]);
  const openModal = (tab) => {
    setActiveTab(tab);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("here");
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      // setLoading(true);
      setCurrentUserState((prev) => ({
        ...prev,
        isLoading: true,
      }));
      try {
        const currentData = await fetchData(
          new Date().getFullYear(),
          new Date().toLocaleString("default", { month: "long" }),
          "Current"
        );
        if (currentData.success) {
          setCurrentIncome(currentData.currentData.income);
          setCurrentExpense(currentData.currentData.expense);
          setCurrentItemList(currentData.currentData.items);

          if (currentData.currentData.items.length > 0) {
            const categorySpendingsArray = currentData.currentData.items
              .filter((item) => item.type === "Expense")
              .reduce((acc, item) => {
                const existingCategory = acc.find(
                  (category) => category.category === item.category
                );

                if (existingCategory) {
                  existingCategory.amount += item.amount || 0;
                } else {
                  acc.push({
                    category: item.category,
                    amount: item.amount || 0,
                    icon: getIconForCategory(item.category),
                  });
                }

                return acc;
              }, [])
              .sort((a, b) => b.amount - a.amount);

            const categoryIncomeArray = currentData.currentData.items
              .filter((item) => item.type === "Income")
              .reduce((acc, item) => {
                const existingCategory = acc.find(
                  (category) => category.category === item.category
                );

                if (existingCategory) {
                  existingCategory.amount += item.amount || 0;
                } else {
                  acc.push({
                    category: item.category,
                    amount: item.amount || 0,
                  });
                }

                return acc;
              }, [])
              .sort((a, b) => b.amount - a.amount);

            setCategoryWiseSpendings(categorySpendingsArray);
            setCategoryWiseIncome(categoryIncomeArray);
          } else {
            setCategoryWiseSpendings([]);
            setCategoryWiseIncome([]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // setCategoryWiseSpendings([]);
        // setCategoryWiseIncome([]);
      } finally {
        // setLoading(false);
        setCurrentUserState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };
    fetchDataAsync();
  }, [action]);
  // // Render the loader if data is still loading
  // if (currentUserState.isLoading) {
  //   return <Loader />;
  // }

  console.log(categoryWiseSpendings);
  return (
    <div className="min-h-screen bg-[#eaeaea]">
      <SidebarLayout>
        {currentUserState.isLoading ? (
          <>
            {/* here */}
            <Loader></Loader>
          </>
        ) : (
          <>
            <div className="flex justify-between my-3 ">
              <h2 className="text-3xl">Current Savings Portal</h2>
              <DropDownButton openModal={openModal} />
            </div>
            <div className="grid grid-cols-1 md:grid-rows-7 md:grid-cols-3 gap-4 ">
              <div
                className="p-6  flex items-center flex-col justify-center rounded-2xl bg-gradient-to-r from-orange-500  to-pink-500 text-white"
                style={{ overflow: "hidden" }}
              >
                <h2>Current Savings</h2>
                <h2 className="text-4xl">${currentIncome - currentExpense}</h2>
              </div>
              <div
                className="p-6 rounded-2xl text-white"
                style={{ background: "#111f36", overflow: "hidden" }}
              >
                <h2>Current Expenses</h2>
                <h2 className="text-4xl">${currentExpense}</h2>
              </div>
              <div
                style={{ background: "", overflow: "hidden" }}
                className=" rounded-2xl col-span-1 row-span-2"
              >
                {categoryWiseIncome.length === 0 ? (
                  <>Nothing to show...</>
                ) : (
                  <IncomeGraph spendingData={categoryWiseIncome} />
                )}
                {/* <h2>Current Expense</h2>
                <h2 className="text-4xl">${currentExpense}</h2> */}
              </div>
              <div
                className="p-6 bg-pink-400 rounded-2xl  text-white w-full"
                style={{ overflow: "hidden" }}
              >
                {categoryWiseSpendings.length === 0 ? (
                  <>Noting to show...</>
                ) : (
                  <div>
                    <h2>Top Spendings </h2>
                    <div className="flex flex-col ">
                      {categoryWiseSpendings.map((item, index) => (
                        <div key={index} className="flex  py-2 gap-2">
                          <img
                            src={item.icon}
                            alt="Icon"
                            // className="" // Adjust the size as needed
                          />
                          <div>
                            <h2>{item.category}</h2>
                            <h2>${item.amount.toLocaleString()}</h2>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div
                className="p-6 rounded-2xl text-white"
                style={{ background: "#111f36", overflow: "hidden" }}
              >
                <h2>Current Income</h2>
                <h2 className="text-4xl">${currentIncome}</h2>
              </div>
              <div
                className="p-6 rounded-2xl col-span-2 row-span-1"
                style={{ background: "#ffcbfb", overflow: "hidden" }}
              >
                <LineGraph
                  spendings={categoryWiseSpendings}
                  income={categoryWiseIncome}
                />
                {/* <h2>Line graph</h2>
                <h2 className="text-4xl">${currentIncome}</h2> */}
              </div>
              <div
                className="p-6 rounded-2xl col-span-1 row-span-1"
                style={{ background: "#ffcbfb", overflow: "hidden" }}
              >
                <h2>Current Income</h2>
                <h2 className="text-4xl">${currentIncome}</h2>
              </div>

              {/* <div className="md:col-span-3 grid grid-cols-4 row-span-1 gap-4"></div> */}
              {/* <div
                className="p-6 rounded-2xl"
                style={{ background: "#ceffae", overflow: "hidden" }}
              >
                <h2>Current Savings</h2>
                <h2 className="text-4xl">${currentIncome - currentExpense}</h2>
              </div> */}
              <div className="md:col-span-3 grid grid-cols-4 row-span-1 gap-4 h-full">
                <div
                  className="pt-6 md:col-span-2 flex flex-col items-center rounded-2xl"
                  style={{ background: "white", overflow: "hidden" }}
                >
                  {/* <h2 className="mb-4 text-center">Current Income</h2>
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
                  </Button> */}

                  {currentItemList.length > 0 ? (
                    <div style={{ padding: "10px", width: "100%" }}>
                      {currentItemList
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
                  {/* <h2 className="mb-4 text-center">Current Expenses</h2>
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
                  </Button> */}
                  {currentItemList.length > 0 ? (
                    <div
                      style={{
                        padding: "10px",
                        width: "100%",
                        maxHeight: "200px",
                        overflowY: "auto",
                      }}
                    >
                      {currentItemList
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
          </>
        )}
      </SidebarLayout>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddIncome={handleAddIncome}
        onAddExpense={handleAddExpense}
        activeTab={activeTab} // Pass active tab to the modal
        type="Current"
        setAction={setActions}
      />
    </div>
  );
}
