// src/routes/monthlyData.routes.ts
import express, { Router, Response } from "express";
// import MonthlyDataModel from "../models/monthlyData.model";
// import MonthlyDataModel, { MonthlyData } from "../models/monthlyData";
// import { detokenizeAdmin } from "../middleware/auth.middleware";
import { detokenizeAdmin } from "../middleware/index";
import { AuthenticatedRequest } from "../middleware/index";
// import { YearlyData } from "../models/monthlyData";
import Stripe from "stripe";
import { Error } from "mongoose";
import { AdminModel } from "../models/admin";
import { MonthlyDataModel } from "../models/dynamodb/MonthlyData";
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

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      // Create or get the monthly data record
      const monthlyDataRecord = await MonthlyDataModel.createOrGet(userId, year, month);

      // Prepare the item data
      const itemData = {
        category,
        title: item,
        amount: itemType === "Income" ? income : expense,
        type: itemType,
        date,
      };

      // Add the item to the appropriate type (actual, current, or target)
      const typeLower = type.toLowerCase() as 'actual' | 'current' | 'target';
      const updatedRecord = await MonthlyDataModel.addItem(
        userId,
        year,
        month,
        itemData,
        typeLower
      );

      if (!updatedRecord) {
        return res.status(500).json({
          success: false,
          message: "Failed to save item",
        });
      }

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

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const type = selectedType.toLowerCase();
    const portal = selectedPortal.toLowerCase();
    console.log(selectedMonth, portal, type, selectedYear);

    try {
      // Check if the monthly data record exists
      const monthlyDataRecord = await MonthlyDataModel.findByUserIdAndMonth(
        userId,
        selectedYear,
        selectedMonth
      );

      if (!monthlyDataRecord) {
        return res
          .status(404)
          .json({ success: false, message: "Document not found" });
      }

      // Get the items to delete for validation
      const portalData = monthlyDataRecord.monthlyData[portal as 'actual' | 'current' | 'target'];
      const itemsToDelete = portalData.items.filter((item: any) =>
        itemIds.includes(item.itemId)
      );

      if (!itemsToDelete.length) {
        return res
          .status(404)
          .json({ success: false, message: "No items found to delete" });
      }

      console.log("itemsToDelete", itemsToDelete);

      // Delete the items using the DynamoDB model
      const result = await MonthlyDataModel.deleteItems(
        userId,
        selectedYear,
        selectedMonth,
        itemIds,
        portal as 'actual' | 'current' | 'target'
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

      if (type === "savingsdashboard") {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: "User not authenticated",
          });
        }

        // Get all data for the user for the specified year
        const yearlyData = await MonthlyDataModel.findByYear(req.user, parseInt(year));
        console.log("yearlyData", yearlyData);

        if (!yearlyData || yearlyData.length === 0) {
          return res.status(404).json({
            success: false,
            message: "No data found for the specified year.",
          });
        }

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

        // Calculate totals for the year
        let totalActualIncome = 0;
        let totalActualExpenses = 0;
        let totalCurrentIncome = 0;
        let totalCurrentExpenses = 0;
        let totalTargetIncome = 0;
        let totalTargetExpenses = 0;

        yearlyData.forEach((record) => {
          const monthData = record.monthlyData;
          totalActualIncome += monthData.actual.income;
          totalActualExpenses += monthData.actual.expense;
          totalCurrentIncome += monthData.current.income;
          totalCurrentExpenses += monthData.current.expense;
          totalTargetIncome += monthData.target.income;
          totalTargetExpenses += monthData.target.expense;

          const monthInfo = {
            month: monthData.month,
            actual: monthData.actual.income - monthData.actual.expense,
            current: monthData.current.income - monthData.current.expense,
            target: monthData.target.income - monthData.target.expense,
            incomeVariance: monthData.target.income - monthData.actual.income,
            expenseVariance: monthData.target.expense - monthData.actual.expense,
            incomeGrowthPercent: previousMonthIncome
              ? ((monthData.actual.income - previousMonthIncome) / previousMonthIncome) * 100
              : 0,
            expenseGrowthPercent: previousMonthExpense
              ? ((monthData.actual.expense - previousMonthExpense) / previousMonthExpense) * 100
              : 0,
          };
          console.log("monthInfo", monthInfo);
          monthWiseData.push(monthInfo);
          // Update previous values for the next iteration
          previousMonthIncome = monthData.actual.income;
          previousMonthExpense = monthData.actual.expense;
        });

        // Add data for months where data is not present
        monthNames.forEach((monthName) => {
          const monthExists = monthWiseData.some(
            (data) => data.month === monthName
          );
          if (!monthExists) {
            monthWiseData.push({
              month: monthName,
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
          annualActualSavings: totalActualIncome - totalActualExpenses,
          annualTargetSavings: totalTargetIncome - totalTargetExpenses,
          annualCurrentSavings: totalCurrentIncome - totalCurrentExpenses,
          monthWiseData: monthWiseData,
        });
      }

      // For specific month and type requests
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const monthlyDataRecord = await MonthlyDataModel.findByUserIdAndMonth(
        req.user,
        parseInt(year),
        month
      );

      if (!monthlyDataRecord) {
        return res.status(200).json({
          success: true,
          message: "No data found for the specified month.",
        });
      }

      console.log("monthlyEntry", monthlyDataRecord.monthlyData);

      if (type === "Current") {
        res.status(200).json({
          success: true,
          currentData: monthlyDataRecord.monthlyData.current,
        });
      }
      if (type === "Target") {
        res.status(200).json({
          success: true,
          targetData: monthlyDataRecord.monthlyData.target,
        });
      }
      if (type === "Actual") {
        res.status(200).json({
          success: true,
          actualData: monthlyDataRecord.monthlyData.actual,
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
