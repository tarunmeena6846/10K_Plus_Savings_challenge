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
import MonthwiseDataGraph from "./LineGraph";
import IncomeVsExpenseGraph from "./IncomeVsExpense";
import { useNavigate } from "react-router-dom";
import { getIncomeAndExpenseArray } from "./getSortedIncomeAndSpendingArray";

export default function CurrentDashboard() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  console.log(currentUserState);
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
            await getIncomeAndExpenseArray(
              currentData.currentData.items,
              setCategoryWiseIncome,
              setCategoryWiseSpendings
            );
          } else {
            setCategoryWiseSpendings([]);
            setCategoryWiseIncome([]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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

  console.log(currentIncome);
  return (
    <div className="h-full bg-[#111f36] lg:bg-[#eaeaea] ">
      <SidebarLayout>
        {currentUserState.isLoading ? (
          <>
            {/* here */}
            <Loader></Loader>
          </>
        ) : (
          <>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between my-3 ">
              <h2 className="text-white lg:text-black text-3xl">
                Current Savings Portal
              </h2>
              <div className="flex gap-2 justify-end sm:justify-between m-3 sm:m-0">
                <DropDownButton openModal={openModal} type={"Curent"} />
                <button
                  className="bg-green-500 px-5 py-2.5 text-sm rounded-3xl text-white hover:bg-green-800"
                  onClick={() => {
                    navigate("/analytics", {
                      state: {
                        type: "Current",
                        option: "Income",
                      },
                    });
                  }}
                >
                  View Analytics
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-rows-5 md:grid-cols-6 gap-4  text-black ">
              <div
                className="p-6  text-center rounded-2xl bg-gradient-to-r from-orange-500  to-pink-500  md:col-span-2 md:row-span-1"
                style={{ overflow: "hidden" }}
              >
                <h2>Current Savings</h2>
                <h2 className="text-4xl">${currentIncome - currentExpense}</h2>
              </div>
              <div
                className="p-6 rounded-2xl  md:col-span-2 md:row-span-1 bg-gradient-to-r from-[#A5CC82] to-[#00467F] text-center"
                style={{ background: "", overflow: "hidden" }}
              >
                <h2>Current Income</h2>
                <h2 className="text-4xl">${currentIncome}</h2>
              </div>
              <div
                className="p-6 rounded-2xl  md:col-span-2 md:row-span-1 bg-gradient-to-r from-[#085078]  to-[#2980B9] text-center"
                style={{ background: "", overflow: "hidden" }}
              >
                <h2>Current Expenses</h2>
                <h2 className="text-4xl">${currentExpense}</h2>
              </div>

              <div
                style={{ background: "", overflow: "hidden" }}
                className=" rounded-2xl md:col-span-2 md:row-span-2"
              >
                {/* {categoryWiseIncome.length === 0 ? ( */}
                {/* // <>Nothing to show...</> */}
                {/* ) : ( */}
                <IncomeGraph spendingData={categoryWiseIncome} />
                {/* )} */}
                {/* <h2>Current Expense</h2>
                <h2 className="text-4xl">${currentExpense}</h2> */}
              </div>
              <div
                className="p-6 bg-[#C779D0] rounded-2xl w-full md:col-span-2 md:row-span-2"
                style={{ overflow: "hidden" }}
              >
                {/* {categoryWiseSpendings.length === 0 ? (
                  <>Noting to show...</>
                ) : ( */}
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
                {/* )} */}
              </div>

              <div
                className=" rounded-2xl md:col-span-2 md:row-span-2"
                style={{ background: "", overflow: "hidden" }}
              >
                <IncomeVsExpenseGraph
                  income={currentIncome}
                  expense={currentExpense}
                />
                {/* <h2>Current Income</h2>
                <h2 className="text-4xl">${currentIncome}</h2> */}
              </div>
              <div
                className=" rounded-2xl md:col-span-6 md:row-span-2"
                style={{ background: "", overflow: "hidden" }}
              >
                <MonthwiseDataGraph expenseAndIncome={currentItemList} />
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
