import React, { useEffect, useState } from "react";
import SidebarLayout from "../SidebarLayout";
import { Button } from "@mui/material";
import AddTransactionModal from "./InputModel";
import { handleAddIncome, handleAddExpense } from "./AddIncomeAndExpense";
import { fetchData } from "./fetchIncomeAndExpenseData";
import { useRecoilState } from "recoil";
import { actionsState, userState } from "../store/atoms/user";
import Loader from "../community/Loader";
import { DropDownButton } from "../DropDown/button";
import SpendingGraph from "../SpendingBarGraph";

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
  const [categoryWiseSpendings, setCategoryWiseSpendings] = useState({});
  const [categoryWiseIncome, setCategoryWiseIncome] = useState({});
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
      // await new Promise((resolve) => setTimeout(resolve, 4000)); // 1-second delay
      // Set loading to true before starting the fetch
      setCurrentUserState((prev) => ({
        ...prev,
        isLoading: true,
      }));

      const currentData = await fetchData(
        new Date().getFullYear(),
        new Date().toLocaleString("default", { month: "long" }),
        "Current"
      );
      if (currentData.success) {
        console.log(currentData);
        setCurrentIncome(currentData.currentData.income);
        setCurrentExpense(currentData.currentData.expense);
        setCurrentItemList(currentData.currentData.items);

        if (currentData.currentData.items.length > 0) {
          // console.log(currentItemList);
          const categorySpendingsObj = currentData.currentData.items.reduce(
            (acc, item) => {
              if (item.type === "Expense") {
                if (!acc[item.category]) {
                  acc[item.category] = 0;
                }
                acc[item.category] += item.amount;
              }
              return acc;
            },
            {}
          );

          const categoryIncomeObj = currentData.currentData.items.reduce(
            (acc, item) => {
              if (item.type === "Income") {
                if (!acc[item.category]) {
                  acc[item.category] = 0;
                }
                acc[item.category] += item.amount;
              }
              return acc;
            },
            {}
          );
          // .sort((a, b) => b[1] - a[1]);

          // Convert to an array of [category, amount] pairs and sort by amount in descending order
          const sortedExpense = Object.entries(categorySpendingsObj).sort(
            (a: any, b: any) => b[1] - a[1]
          );

          console.log(sortedExpense);
          // Convert the sorted array back to an object
          const sortedExpenseObject = Object.fromEntries(sortedExpense);

          // Convert to an array of [category, amount] pairs and sort by amount in descending order
          const sortedIncome = Object.entries(categoryIncomeObj).sort(
            (a: any, b: any) => b[1] - a[1]
          );

          // Convert the sorted array back to an object
          const sortedIncomeObject = Object.fromEntries(sortedIncome);

          console.log(sortedIncomeObject);
          setCategoryWiseSpendings(sortedExpenseObject);
          setCategoryWiseIncome(sortedIncomeObject);
        }
      }
      setCurrentUserState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    };
    fetchDataAsync();
  }, [action]);

  // // Render the loader if data is still loading
  // if (currentUserState.isLoading) {
  //   return <Loader />;
  // }
  console.log(categoryWiseIncome);
  return (
    <div className="min-h-screen bg-[#eaeaea]">
      <SidebarLayout>
        {currentUserState.isLoading ? (
          <>
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
                className="p-6  rounded-2xl bg-gradient-to-r from-orange-500  to-pink-500 text-white"
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
                <SpendingGraph spendingData={categoryWiseIncome} />

                {/* <h2>Current Expense</h2>
                <h2 className="text-4xl">${currentExpense}</h2> */}
              </div>
              <div
                className="p-6 bg-pink-400 rounded-2xl w-full"
                style={{ overflow: "hidden" }}
              >
                <h2>Top Income source </h2>
                <h2 className="text-4xl">${currentIncome}</h2>
                {/* <SpendingGraph spendingData={categoryWiseIncome} /> */}
              </div>
              <div
                className="p-6 rounded-2xl text-white"
                style={{ background: "#111f36", overflow: "hidden" }}
              >
                <h2>Income</h2>
                <h2 className="text-4xl">${currentIncome}</h2>
              </div>
              <div
                className="p-6 rounded-2xl col-span-2 row-span-2"
                style={{ background: "#ffcbfb", overflow: "hidden" }}
              >
                <h2>Line graph</h2>
                <h2 className="text-4xl">${currentIncome}</h2>
              </div>
              <div
                className="p-6 rounded-2xl col-span-1 row-span-2"
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
              <div className="md:col-span-3 grid grid-cols-4 row-span-5 gap-4 h-full">
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
