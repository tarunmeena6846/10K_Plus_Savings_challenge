import React, { useEffect, useState } from "react";
import SidebarLayout from "../SidebarLayout";
import { Button } from "@mui/material";
import AddTransactionModal from "./InputModel";
import { handleAddIncome, handleAddExpense } from "./AddIncomeAndExpense";
import { fetchData } from "./fetchIncomeAndExpenseData";
import { useRecoilState } from "recoil";
import { actionsState, userState } from "../store/atoms/user";
import Loader from "../community/Loader";

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

  const openModal = (tab) => {
    setActiveTab(tab);
    setIsModalOpen(true);
  };

  const closeModal = () => {
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
        setCurrentIncome(currentData.currentData.income);
        setCurrentExpense(currentData.currentData.expense);
        setCurrentItemList(currentData.currentData.items);
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

  return (
    <div>
      <SidebarLayout>
        {currentUserState.isLoading ? (
          <>
            <Loader></Loader>
          </>
        ) : (
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
