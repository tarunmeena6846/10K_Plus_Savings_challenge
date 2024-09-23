import React, { useEffect, useState } from "react";
import SidebarLayout from "../SidebarLayout";
import { monthIncExpInfo } from "../Dashboard";
import { Button } from "@mui/material";
import AddTransactionModal from "./InputModel";
import { handleAddIncome, handleAddExpense } from "./AddIncomeAndExpense";
import { fetchData } from "./fetchIncomeAndExpenseData";
import { actionsState, userState } from "../store/atoms/user";
import { useRecoilState } from "recoil";
import Loader from "../community/Loader";
import { useNavigate } from "react-router-dom";
import { getIncomeAndExpenseArray } from "../getSortedIncomeAndSpendingArray";
import { DropDownButton } from "../DropDown/button";
import IncomeGraph from "../SpendingBarGraph";
import IncomeVsExpenseGraph from "../IncomeVsExpense";
import MonthwiseDataGraph from "../LineGraph";

export default function TargetDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0); // State to track active tab in modal
  const [targetItemList, setTargetItemList] = useState([]);
  const [targetIncome, setTargetIncome] = useState(0);
  const [targetExpense, setTargetExpense] = useState(0);
  const [action, setActions] = useRecoilState(actionsState);
  const [categoryWiseSpendings, setCategoryWiseSpendings] = useState([]);
  const [categoryWiseIncome, setCategoryWiseIncome] = useState([]);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const openModal = (tab) => {
    setActiveTab(tab);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const fetchDataAsync = async () => {
      setCurrentUserState((prev) => ({ ...prev, isLoading: true }));
      const targetData = await fetchData(
        new Date().getFullYear(),
        new Date().toLocaleString("default", { month: "long" }),
        "Target"
      );
      if (targetData.success) {
        setTargetIncome(targetData.targetData.income);
        setTargetExpense(targetData.targetData.expense);
        setTargetItemList(targetData.targetData.items);

        if (targetData.targetData.items.length > 0) {
          await getIncomeAndExpenseArray(
            targetData.targetData.items,
            setCategoryWiseIncome,
            setCategoryWiseSpendings
          );
        } else {
          setCategoryWiseSpendings([]);
          setCategoryWiseIncome([]);
        }
      }
      setCurrentUserState((prev) => ({ ...prev, isLoading: false }));
    };
    fetchDataAsync();
  }, [action]); // Run this effect only once when the component mounts

  return (
    <div className="h-full bg-[#111f36] lg:bg-[#eaeaea]">
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
                Target Savings Portal
              </h2>
              <div className="flex gap-2 justify-end sm:justify-between m-3 sm:m-0">
                <DropDownButton openModal={openModal} type={"Target"} />
                <button
                  className="bg-green-500 px-5 py-2.5 text-sm rounded-3xl text-white hover:bg-green-800"
                  onClick={() => {
                    navigate("/analytics", {
                      state: {
                        type: "Target",
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
                <h2>Target Savings</h2>
                <h2 className="text-4xl">${targetIncome - targetExpense}</h2>
              </div>
              <div
                className="p-6 rounded-2xl  md:col-span-2 md:row-span-1 bg-gradient-to-r from-[#A5CC82] to-[#00467F] text-center"
                style={{ background: "", overflow: "hidden" }}
              >
                <h2>Target Income</h2>
                <h2 className="text-4xl">${targetIncome}</h2>
              </div>
              <div
                className="p-6 rounded-2xl  md:col-span-2 md:row-span-1 bg-gradient-to-r from-[#085078]  to-[#2980B9] text-center"
                style={{ background: "", overflow: "hidden" }}
              >
                <h2>Target Expenses</h2>
                <h2 className="text-4xl">${targetExpense}</h2>
              </div>

              <div
                style={{ background: "", overflow: "hidden" }}
                className=" rounded-2xl md:col-span-2 md:row-span-2"
              >
                {/* {categoryWiseIncome.length === 0 ? (
                  <>Nothing to show...</> */}
                {/* ) : ( */}
                <IncomeGraph spendingData={categoryWiseIncome} />
                {/* )} */}
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
                  income={targetIncome}
                  expense={targetExpense}
                />
              </div>
              <div
                className=" rounded-2xl md:col-span-6 md:row-span-2"
                style={{ background: "", overflow: "hidden" }}
              >
                <MonthwiseDataGraph expenseAndIncome={targetItemList} />
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
        activeTab={activeTab}
        type="Target" // Pass active tab to the modal
        setAction={setActions}
      />
    </div>
  );
}
