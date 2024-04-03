//Fetch monthly data from the backend
export const fetchData = async (
  year: Number,
  month?: String,
  type?: String
) => {
  try {
    // console.log("selectedDate", selectedDate);
    const token = localStorage.getItem("token"); // Get the token from your authentication process
    const date = new Date();
    const response = await fetch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/data/get-list/${year}/${month}/${type}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    console.log("Monthly data", data);
    if (data.success) {
      return data;
      // setMonthlyIncome(0);
      // // setMonthlyExpense(0);
      // console.log("inside");
      // // setYearlyExpense(data.yearlyEntry.totalExpenses);
      // setYearlyIncome(data.yearlyEntry.totalIncome);
      // setProjectedUserData(data.yearlyEntry.projectedYearlySavings);
      // console.log("yearly entry:", data.yearlyEntry.monthlyData);
      // const allMonthsData = months.map((month) => {
      //   console.log("month", month);
      //   const existingEntry = data.yearlyEntry.monthlyData.find(
      //     (entry: { month: String }) => entry.month === month
      //   );
      //   if (existingEntry) {
      //     const actualSavings =
      //       existingEntry.monthlyIncome - existingEntry.monthlyExpenses;
      //     return {
      //       month,
      //       actualSavings,
      //       projectedSaving: data.yearlyEntry.projectedYearlySavings,
      //     };
      //   } else {
      //     return {
      //       month,
      //       actualSavings: 0,
      //       projectedSaving: data.yearlyEntry.projectedYearlySavings,
      //     };
      //   }
      // });
      // console.log("allmonthdata", allMonthsData);
      // setMonthlyData(allMonthsData);
      // if (data.monthlyEntry) {
      //   setMonthlyIncome(data.monthlyEntry.monthlyIncome);
      //   setMonthlyExpense(data.monthlyEntry.monthlyExpenses);
      // }
      // // return <MonthlyBarGraph allMonthsData={allMonthsData} />;
      // setIsMonthlyDataReady(true); // Set the flag to true when data is ready
      // if (data.yearlyEntry.projectedYearlySavings === 0) {
      //   // navigate("/projecteddashboard");
      // }
      // setMonthIncExpInfo(data.items);
    } else {
      return null;
      // console.error("Failed to fetch monthly data");
      // setMonthlyIncome(0);
      // console.log("data", data);
      // setProjectedUserData(0);
      // setMonthlyExpense(0);
      // setYearlyExpense(0);
      // setYearlyIncome(0);
      // navigate("/projecteddashboard");
    }

    // console.log("monthlyData", monthlyData);
  } catch (error) {
    console.error("Error fetching monthly data:", error);
    // setMonthlyIncome(0);
    // setMonthlyExpense(0);
    // setYearlyExpense(0);
    // setYearlyIncome(0);
  }
};
