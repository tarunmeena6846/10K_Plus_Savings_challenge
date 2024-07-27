import React, { useEffect, useState } from "react";
import SidebarLayout from "../components/SidebarLayout";
import { months } from "../components/MonthlyIncome";
import AnalyticsTable from "./AnalyticsTable";
import { fetchData } from "../components/Dashboard/fetchIncomeAndExpenseData";

const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
const types = ["Current", "Actual", "Target"];
const options = ["Income", "Expense"];

const AnalyticsLanding = () => {
  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedType, setSelectedType] = useState(options[0]);
  const [selectedPortal, setSelectedPortal] = useState(types[0]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [monthlyItems, setMonthlyItems] = useState([]);
  const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState(null);

  const handleChange = (e: any) => {
    setSelectedMonth(e.target.value);
  };

  const fetchAnalyticsData = async () => {
    setLoading(true); // Set loading state to true before fetching data
    // setError(null); // Reset the error state

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
    } catch (error) {
      setMonthlyIncome(0);
      setMonthlyExpense(0);
      setMonthlyItems([]);
      console.error("Failed to fetch analytics data:", error);
      //   setError("Failed to fetch analytics data.");
    } finally {
      setLoading(false); // Set loading state to false after data is fetched or an error occurs
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedMonth, selectedYear, selectedPortal, selectedType]);

  useEffect(() => {
    console.log("Updated state:", {
      selectedMonth,
      selectedYear,
      selectedType,
      selectedPortal,
      monthlyIncome,
      monthlyExpense,
      monthlyItems,
    });
  }, [
    selectedMonth,
    selectedYear,
    selectedType,
    selectedPortal,
    monthlyIncome,
    monthlyExpense,
    monthlyItems,
  ]);

  return (
    <SidebarLayout>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex gap-4">
            <div className="flex">
              <img src="./calender1.svg" alt="Calendar" />
              <select
                onChange={handleChange}
                value={selectedMonth}
                className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
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
                className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                {years.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex">
              <img src="./calender1.svg" alt="Calendar" />
              <select
                onChange={(e) => {
                  setSelectedPortal(e.target.value);
                }}
                value={selectedPortal}
                className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                {types.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex">
              <img src="./calender1.svg" alt="Calendar" />
              <select
                onChange={(e) => {
                  setSelectedType(e.target.value);
                }}
                value={selectedType}
                className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                {options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-rows-1 md:grid-cols-3 gap-4 my-4">
            <div
              className="p-6 rounded-2xl"
              style={{ background: "#ffcbfb", overflow: "hidden" }}
            >
              <h2>Current Income</h2>
              <h2 className="text-4xl">${monthlyIncome}</h2>
            </div>
            <div
              className="p-6 rounded-2xl"
              style={{ background: "#b2edff", overflow: "hidden" }}
            >
              <h2>Current Expense</h2>
              <h2 className="text-4xl">${monthlyExpense}</h2>
            </div>
            <div
              className="p-6 rounded-2xl"
              style={{ background: "#ceffae", overflow: "hidden" }}
            >
              <h2>Current Savings</h2>
              <h2 className="text-4xl">${monthlyIncome - monthlyExpense}</h2>
            </div>
          </div>
          <hr className="h-0.5 bg-gray-600" />
          <AnalyticsTable items={monthlyItems} type={selectedType} />
        </>
      )}
    </SidebarLayout>
  );
};

export default AnalyticsLanding;
