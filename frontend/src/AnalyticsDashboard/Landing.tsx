import React, { useEffect, useState } from "react";
import SidebarLayout from "../components/SidebarLayout";
import { months } from "../components/MonthlyIncome";
import AnalyticsTable from "./AnalyticsTable";
import { fetchData } from "../components/Dashboard/fetchIncomeAndExpenseData";
import { useRecoilState } from "recoil";
import { actionsState, userState } from "../components/store/atoms/user";
import Loader from "../components/community/Loader";
import { useLocation } from "react-router-dom";
import { Modal } from "flowbite-react";
import PopupModal from "../components/DeletePopup";
import { response } from "express";
import SuccessPopup from "../components/SWOTanalysisPortal/SuccessfulPopup";

export const formatAmount = (amount: number) => {
  return amount.toLocaleString(); // Formats number with commas
};

const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
const types = ["Current", "Actual", "Target"];
const options = ["Income", "Expense"];

const AnalyticsLanding = () => {
  const location: any = useLocation();
  const { type, option } = location.state || {
    type: types[0],
    option: options[0],
  };
  console.log(type, option);

  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  // // const [selectedType, setSelectedType] = useState(options[0]);
  const [selectedType, setSelectedType] = useState(option);

  const [selectedPortal, setSelectedPortal] = useState(type);

  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [monthlyItems, setMonthlyItems] = useState([]);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  // const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState([]);
  const [showDeleteModal, setShowDeleteConfirmModal] = useState(false);
  const [successfulPopup, setSuccessfulPopup] = useState(false);
  const [action, setAction] = useRecoilState(actionsState);
  const handleChange = (e: any) => {
    setSelectedMonth(e.target.value);
  };

  const fetchAnalyticsData = async () => {
    setCurrentUserState((prev) => ({ ...prev, isLoading: true }));

    try {
      console.log(
        "Fetching data for:",
        selectedYear,
        selectedMonth,
        selectedPortal,
        selectedType
      );
      const fetchedData = await fetchData(
        selectedYear,
        selectedMonth,
        selectedPortal
      );

      console.log("Fetched data:", fetchedData, new Date().getMonth());
      setMonthlyIncome(
        selectedPortal === "Target"
          ? fetchedData.targetData.income
          : selectedPortal === "Actual"
          ? fetchedData.actualData.income
          : fetchedData.currentData.income
      );
      setMonthlyExpense(
        selectedPortal === "Target"
          ? fetchedData.targetData.expense
          : selectedPortal === "Actual"
          ? fetchedData.actualData.expense
          : fetchedData.currentData.expense
      );
      setMonthlyItems(
        selectedPortal === "Target"
          ? fetchedData.targetData.items
          : selectedPortal === "Actual"
          ? fetchedData.actualData.items
          : fetchedData.currentData.items
      );
      // setCurrentUserState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      setMonthlyIncome(0);
      setMonthlyExpense(0);
      setMonthlyItems([]);
      console.error("Failed to fetch analytics data:", error);
      //   setError("Failed to fetch analytics data.");
    } finally {
      setCurrentUserState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDelete = async () => {
    setShowDeleteConfirmModal(false);
    console.log(selectedEntry);
    setCurrentUserState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/data/deleteItem`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            selectedEntry,
            selectedMonth,
            selectedYear,
            selectedType,
            selectedPortal,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response is not ok");
      }
      const data = await response.json();
      if (data.success) {
        setAction((prev) => prev + 1);
        setSuccessfulPopup(true);
      }
      setCurrentUserState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    } catch (error) {
      alert("Issue while deleting");
      setCurrentUserState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };
  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedMonth, selectedYear, selectedPortal, selectedType, action]);
  console.log(monthlyItems);
  return (
    <div className="min-h-screen bg-[#eaeaea]">
      <SidebarLayout>
        {currentUserState.isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-rows-1 md:grid-cols-3 gap-4 my-4">
              <div
                className="p-6 rounded-2xl border-4 border-pink-400 bg-white"
                style={{ background: "", overflow: "hidden" }}
              >
                <h2>{selectedPortal} Income</h2>
                <h2 className="text-4xl">${formatAmount(monthlyIncome)}</h2>
              </div>
              <div
                className="p-6 rounded-2xl border-4 border-blue-500 bg-white"
                style={{ background: "#", overflow: "hidden" }}
              >
                <h2>{selectedPortal} Expense</h2>
                <h2 className="text-4xl">${formatAmount(monthlyExpense)}</h2>
              </div>
              <div
                className="p-6 rounded-2xl border-4 border-green-400 bg-white"
                style={{ background: "", overflow: "hidden" }}
              >
                <h2>{selectedPortal} Savings</h2>
                <h2 className="text-4xl">
                  ${formatAmount(monthlyIncome - monthlyExpense)}
                </h2>
              </div>
            </div>
            <div className="flex gap-4 mb-3">
              <div className="flex">
                {/* <img src="./calender1.svg" alt="Calendar" /> */}
                <select
                  onChange={handleChange}
                  value={selectedMonth}
                  className="bg-white px-4 py-2 rounded-3xl appearance-none"
                  style={{
                    backgroundImage: `
            url('./calender1.svg'), 
            url('data:image/svg+xml;utf8,<svg fill="%23111f36" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')
          `,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "left 12px center, right 12px center",
                    paddingRight: "40px",
                    paddingLeft: "40px",
                  }}
                >
                  {months.map((month, index) => (
                    <option key={index} value={month}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  onChange={(e: any) => {
                    setSelectedYear(e.target.value);
                  }}
                  value={selectedYear}
                  className="bg-white px-4 py-2 rounded-3xl appearance-none"
                  style={{
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="%23111f36" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    paddingRight: "40px",
                  }}
                >
                  {years.map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex">
                {/* <img src="./calender1.svg" alt="Calendar" /> */}
                <select
                  onChange={(e) => {
                    setSelectedPortal(e.target.value);
                  }}
                  value={selectedPortal}
                  className="bg-white px-4 py-2 rounded-3xl appearance-none"
                  style={{
                    backgroundImage: `
            url('./category.svg'), 
            url('data:image/svg+xml;utf8,<svg fill="%23111f36" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')
          `,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "left 12px center, right 12px center",
                    paddingRight: "40px",
                    paddingLeft: "40px",
                  }}
                >
                  {types.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex">
                {/* <img src="./calender1.svg" alt="Calendar" /> */}
                <select
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                  }}
                  value={selectedType}
                  className="bg-white px-4 py-2 rounded-3xl appearance-none"
                  style={{
                    backgroundImage: `
            url('./incomeandexpense.svg'), 
            url('data:image/svg+xml;utf8,<svg fill="%23111f36" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')
          `,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "left 12px center, right 12px center",
                    paddingRight: "40px",
                    paddingLeft: "40px",
                  }}
                >
                  {options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              {isChecked && (
                <div className="">
                  <button
                    className="flex items-end"
                    onClick={() => setShowDeleteConfirmModal(true)}
                  >
                    <img src="./delete.svg"></img>
                    <h2 className="text-red-500">Delete</h2>
                  </button>
                </div>
              )}
            </div>
            <hr className="h-0.5 bg-gray-600" />
            <AnalyticsTable
              items={monthlyItems.filter((item) => item.type === selectedType)}
              // type={selectedType}
              setIsChecked={setIsChecked}
              selectedEntry={selectedEntry}
              setSelectedEntry={setSelectedEntry}
            />
          </>
        )}
      </SidebarLayout>
      {showDeleteModal && (
        <PopupModal
          isModalOpen={showDeleteModal}
          setIsModalOpen={setShowDeleteConfirmModal}
          handleDelete={handleDelete}
          type={"delete"}
        />
      )}

      {successfulPopup && (
        <SuccessPopup
          message="Delete successful!"
          duration={5000}
          onClose={() => setSuccessfulPopup(false)}
        />
      )}
    </div>
  );
};

export default AnalyticsLanding;
