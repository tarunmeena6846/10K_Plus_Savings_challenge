// src/routes/monthlyData.routes.ts
import express, { Router, Response } from "express";
// import MonthlyDataModel from "../models/monthlyData.model";
import MonthlyDataModel, { MonthlyData } from "../models/monthlyData";
// import { detokenizeAdmin } from "../middleware/auth.middleware";
import { detokenizeAdmin } from "../middleware/index";
import { AuthenticatedRequest } from "../middleware/index";
// import { YearlyData } from "../models/monthlyData";
import Stripe from "stripe";
import { Error } from "mongoose";
import { AdminModel } from "../models/admin";
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const stripe = new Stripe(process.env.STRIPE_KEY as string);
const router: Router = express.Router();

router.post(
  "/save-item",
  detokenizeAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { date, category, income, expense, item, type, itemType } =
        req.body;
      const parsedDate = new Date(date);
      console.log(
        "at save item",
        category,
        date,
        income,
        expense,
        itemType,
        type,
        item,
        parsedDate.getMonth() + 1,
        parsedDate.getDate(),
        parsedDate.getFullYear()
      );
      const year = parsedDate.getFullYear();
      const month = parsedDate.toLocaleString("default", { month: "long" });
      const userId = req.user;
      // Check if the user's data for the given year exists
      let monthlyData = await MonthlyDataModel.findOne({
        userId,
        "yearlyData.year": year,
      });

      // If the user's data for the year doesn't exist, create it
      if (!monthlyData) {
        monthlyData = await MonthlyDataModel.create({
          userId,
          yearlyData: [{ year, monthlyData: [] }],
        });
      }

      // Find the index of the month within the yearlyData array
      const yearIndex = monthlyData.yearlyData.findIndex(
        (data) => data.year === year
      );
      const monthIndex = monthlyData.yearlyData[
        yearIndex
      ].monthlyData.findIndex((data) => data.month === month);

      // If the month's data exists, update it; otherwise, insert new data
      if (monthIndex !== -1) {
        // Update existing month's data
        const monthData =
          monthlyData.yearlyData[yearIndex].monthlyData[monthIndex];
        if (type === "Actual") {
          if (itemType === "Income") {
            monthData.actual.income += income;
            monthlyData.yearlyData[yearIndex].totalActualIncome += income;
            monthData.actual.items.push({
              category: category,
              title: item,
              amount: income,
              type: itemType,
              date: date,
            });
          } else {
            monthData.actual.expense += expense;
            monthlyData.yearlyData[yearIndex].totalActualExpenses += expense;
            monthData.actual.items.push({
              category: category,
              title: item,
              amount: expense,
              type: itemType,
              date: date,
            });
          }
          // monthData.actual.items.push({category:category,title:itemName,amount:})
        } else if (type === "Current") {
          if (itemType === "Income") {
            console.log("at current income if block", income);
            monthData.current.income += income;
            monthlyData.yearlyData[yearIndex].totalCurrentIncome += income;
            monthData.current.items.push({
              category: category,
              title: item,
              amount: income,
              date: date,
              type: itemType,
            });
          } else {
            console.log("at add expense in current");
            monthData.current.expense += expense;
            monthlyData.yearlyData[yearIndex].totalCurrentExpenses += expense;
            monthData.current.items.push({
              category: category,
              title: item,
              amount: expense,
              date: date,
              type: itemType,
            });
          }
        } else if (type === "Target") {
          if (itemType === "Income") {
            monthData.target.income += income;
            monthlyData.yearlyData[yearIndex].totalTargetIncome += income;
            monthData.target.items.push({
              category: category,
              title: item,
              amount: income,
              type: itemType,
              date: date,
            });
          } else {
            monthData.target.expense += expense;
            monthlyData.yearlyData[yearIndex].totalTargetExpenses += expense;
            monthData.target.items.push({
              category: category,
              title: item,
              amount: expense,
              type: itemType,
              date: date,
            });
          }
        }
      } else {
        // Insert new month's data
        const newData = {
          month,
          actual:
            type === "Actual"
              ? {
                  income: income,
                  expense: expense,
                  items: [
                    {
                      category: category,
                      title: item,
                      amount: itemType === "Income" ? income : expense,
                      type: itemType,
                      date: date,
                    },
                  ],
                }
              : { income: 0, expense: 0, items: [] },
          current:
            type === "Current"
              ? {
                  income: income,
                  expense: expense,
                  items: [
                    {
                      category: category,
                      title: item,
                      amount: itemType === "Income" ? income : expense,
                      type: itemType,
                      date: date,
                    },
                  ],
                }
              : { income: 0, expense: 0, items: [] },
          target:
            type === "Target"
              ? {
                  income: income,
                  expense: expense,
                  items: [
                    {
                      category: category,
                      title: item,
                      amount: itemType === "Income" ? income : expense,
                      type: itemType,
                      date: date,
                    },
                  ],
                }
              : { income: 0, expense: 0, items: [] },
        };

        console.log("inside else in ", newData, newData.actual.items);
        monthlyData.yearlyData[yearIndex].monthlyData.push(newData);
        if (type === "Actual") {
          if (itemType === "Income") {
            monthlyData.yearlyData[yearIndex].totalActualIncome += income;
          } else {
            monthlyData.yearlyData[yearIndex].totalActualExpenses += expense;
          }
        } else if (type === "Current") {
          if (itemType === "Income") {
            monthlyData.yearlyData[yearIndex].totalCurrentIncome += income;
          } else {
            monthlyData.yearlyData[yearIndex].totalCurrentExpenses += expense;
          }
        } else if (type === "Target") {
          if (itemType === "Income") {
            monthlyData.yearlyData[yearIndex].totalTargetIncome += income;
          } else {
            monthlyData.yearlyData[yearIndex].totalTargetExpenses += expense;
          }
        }
      }

      // Save the updated document
      await monthlyData.save();

      res.status(201).json({
        success: true,
        message: "Item saved successfully",
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
);

router.delete(
  "/deleteItem",
  detokenizeAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    const itemIds = req.body.selectedEntry;
    const { selectedMonth, selectedYear, selectedType, selectedPortal } =
      req.body;
    const userId = req.user;

    const type = selectedType.toLowerCase();
    const portal = selectedPortal.toLowerCase();
    console.log(selectedMonth, portal, type, selectedYear);
    try {
      // Step 1: Find the document and get the current values for calculations

      let monthlyData = await MonthlyDataModel.findOne({
        userId,
        "yearlyData.year": selectedYear,
      });

      if (!monthlyData) {
        return res
          .status(404)
          .json({ success: false, message: "Document not found" });
      }

      // Find the index of the month within the yearlyData array
      const yearIndex = monthlyData.yearlyData.findIndex(
        (data) => data.year === selectedYear
      );
      const monthIndex = monthlyData.yearlyData[
        yearIndex
      ].monthlyData.findIndex((data) => data.month === selectedMonth);

      // If the month's data exists, update it; otherwise, insert new data
      if (monthIndex === -1) {
        return res
          .status(404)
          .json({ success: false, message: "Document not found" });
      }
      // Update existing month's data
      const monthData: any =
        monthlyData.yearlyData[yearIndex].monthlyData[monthIndex];

      // console.log("monthData", monthData);

      const itemsToDelete = monthData[portal].items.filter((item: any) =>
        itemIds.includes(item._id.toString())
      );

      if (!itemsToDelete.length) {
        return res
          .status(404)
          .json({ success: false, message: "No items found to delete" });
      }
      console.log("itemsToDelete", itemsToDelete);
      const totalAmountToDecrement = itemsToDelete.reduce(
        (acc: any, item: any) => acc + item.amount,
        0
      );

      console.log("totalAmountToDecrement", totalAmountToDecrement);

      const updateFields: any = {
        $pull: {
          [`yearlyData.$[yearData].monthlyData.$[monthData].${portal}.items`]: {
            _id: { $in: itemIds },
          },
        },
      };
      if (portal === "current") {
        if (type === "income") {
          updateFields.$inc = {
            [`yearlyData.$[yearData].monthlyData.$[monthData].current.income`]:
              -totalAmountToDecrement,
            [`yearlyData.$[yearData].totalCurrentIncome`]:
              -totalAmountToDecrement,
          };
        } else {
          updateFields.$inc = {
            [`yearlyData.$[yearData].monthlyData.$[monthData].current.expense`]:
              -totalAmountToDecrement,
            [`yearlyData.$[yearData].totalCurrentExpense`]:
              -totalAmountToDecrement,
          };
        }
      } else if (portal === "target") {
        if (type === "income") {
          updateFields.$inc = {
            [`yearlyData.$[yearData].monthlyData.$[monthData].target.income`]:
              -totalAmountToDecrement,
            [`yearlyData.$[yearData].totalTargetIncome`]:
              -totalAmountToDecrement,
          };
        } else {
          updateFields.$inc = {
            [`yearlyData.$[yearData].monthlyData.$[monthData].target.expense`]:
              -totalAmountToDecrement,
            [`yearlyData.$[yearData].totalTargetExpenses`]:
              -totalAmountToDecrement,
          };
        }
      } else if (portal === "actual") {
        if (type === "income") {
          updateFields.$inc = {
            [`yearlyData.$[yearData].monthlyData.$[monthData].actual.income`]:
              -totalAmountToDecrement,
            [`yearlyData.$[yearData].totalActualIncome`]:
              -totalAmountToDecrement,
          };
        } else {
          updateFields.$inc = {
            [`yearlyData.$[yearData].monthlyData.$[monthData].actual.expense`]:
              -totalAmountToDecrement,
            [`yearlyData.$[yearData].totalActualExpenses`]:
              -totalAmountToDecrement,
          };
        }
      }
      // Perform the deletion and update totals
      const result = await MonthlyDataModel.findOneAndUpdate(
        {
          userId,
          "yearlyData.year": selectedYear,
          "yearlyData.monthlyData.month": selectedMonth,
        },
        updateFields,
        {
          arrayFilters: [
            { "yearData.year": selectedYear },
            { "monthData.month": selectedMonth },
          ],
          new: true, // Return the updated document
        }
      );

      if (result) {
        console.log("Items deleted and totals updated successfully:", result);
        res.status(200).json({ success: true });
      } else {
        console.log("Item not found or could not be deleted");
        res.status(404).json({ success: false });
      }
    } catch (error) {
      console.error("Error deleting items and updating totals:", error);
      res.status(500).json({ success: false });
    }
  }
);
// Express Route for retrieving income items
router.get(
  "/get-list/:year/:month/:type",
  detokenizeAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { month, year, type } = req.params;
      console.log(month, year, type);

      const userData = await MonthlyDataModel.findOne({ userId: req.user });
      // let newObj = new MonthlyData();
      console.log("userData", userData);
      if (!userData) {
        return res.status(404).json({
          success: false,
          message: "User data not found for the specified user ID.",
        });
      }

      // Find the yearly entry for the specified year
      const yearlyEntry = userData.yearlyData.find(
        (entry) => entry.year === parseInt(year)
      );

      if (!yearlyEntry) {
        return res.status(404).json({
          success: false,
          userData,
          message: "No data found for the specified year.",
        });
      }
      if (type === "savingsdashboard") {
        const monthWiseData: {
          month: string;
          actual: Number;
          current: Number;
          target: Number;
          incomeVariance: Number;
          expenseVariance: Number;
          incomeGrowthPercent: Number;
          expenseGrowthPercent: Number;
        }[] = [];
        let previousMonthIncome: number = 0;
        let previousMonthExpense: number = 0;
        yearlyEntry.monthlyData.forEach((monthData) => {
          const monthInfo = {
            month: monthData.month,
            actual: monthData.actual.income - monthData.actual.expense,
            current: monthData.current.income - monthData.current.expense,
            target: monthData.target.income - monthData.target.expense,
            incomeVariance: monthData.target.income - monthData.actual.income,
            expenseVariance:
              monthData.target.expense - monthData.actual.expense,
            incomeGrowthPercent: previousMonthIncome
              ? ((monthData.actual.income - previousMonthIncome) /
                  previousMonthIncome) *
                100
              : 0,
            expenseGrowthPercent: previousMonthExpense
              ? ((monthData.actual.expense - previousMonthExpense) /
                  previousMonthExpense) *
                100
              : 0,
          };
          console.log("monthInfo", monthInfo);
          monthWiseData.push(monthInfo);
          // Update previous values for the next iteration
          previousMonthIncome = monthData.actual.income;
          previousMonthExpense = monthData.actual.expense;
        });

        // Add data for months where data is not present
        monthNames.forEach((month) => {
          const monthExists = monthWiseData.some(
            (data) => data.month === month
          );
          if (!monthExists) {
            monthWiseData.push({
              month: month,
              actual: 0,
              current: 0,
              target: 0,
              incomeVariance: 0,
              expenseVariance: 0,
              incomeGrowthPercent: 0,
              expenseGrowthPercent: 0,
            });
          }
        });
        monthWiseData.sort((a, b) => {
          return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
        });

        return res.status(200).json({
          success: true,
          annualActualSavings:
            yearlyEntry.totalActualIncome - yearlyEntry.totalActualExpenses,
          annualTargetSavings:
            yearlyEntry.totalTargetIncome - yearlyEntry.totalTargetExpenses,
          annualCurrentSavings:
            yearlyEntry.totalCurrentIncome - yearlyEntry.totalCurrentExpenses,
          monthWiseData: monthWiseData,
          // SavingsItems: yearlyEntry.monthlyData,
        });
      }
      // Find the monthly entry for the specified month
      const monthlyEntry = yearlyEntry.monthlyData.find(
        (entry) => entry.month === month
      );
      console.log("monthlyEntry", monthlyEntry);
      if (!monthlyEntry) {
        return res.status(200).json({
          success: true,
          // yearlyEntry,
          message: "No data found for the specified month.",
        });
      }
      if (type === "Current") {
        res.status(200).json({
          success: true,
          currentData: monthlyEntry.current,
          // yearlyEntry,
          // monthlyEntry,
        });
      }
      if (type === "Target") {
        res.status(200).json({
          success: true,
          targetData: monthlyEntry.target,
          // yearlyEntry,
          // monthlyEntry,
        });
      }

      if (type === "Actual") {
        res.status(200).json({
          success: true,
          actualData: monthlyEntry.actual,
          // yearlyEntry,
          // monthlyEntry,
        });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
);

export default router;
