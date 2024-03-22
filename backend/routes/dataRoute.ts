// src/routes/monthlyData.routes.ts
import express, { Router, Response } from "express";
// import MonthlyDataModel from "../models/monthlyData.model";
import MonthlyDataModel from "../models/monthlyData";
// import { detokenizeAdmin } from "../middleware/auth.middleware";
import { detokenizeAdmin } from "../middleware/index";
import { AuthenticatedRequest } from "../middleware/index";
// import { YearlyData } from "../models/monthlyData";
import Stripe from "stripe";
import { Error } from "mongoose";
import AdminModel from "../models/admin";
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

// async createSubscription(createSubscriptionRequest) {
/*
router.post(
  "/reset-monthly-data",
  detokenizeAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { month, year } = req.body;
      // currentUserId = req.user._id;
      // console.log("req.user.username at 2", req.user.username, currentUserId);

      const userData = await MonthlyDataModel.findOne({
        userId: req.user,
      });

      if (userData) {
        // User entry exists, find the yearly entry for the specified year
        const yearlyEntry = userData.yearlyData.find(
          (entry) => entry.year === year
        );

        if (yearlyEntry) {
          // Update the totalIncome and totalExpenses based on all monthly entries

          // Year entry exists, find the monthly entry for the specified month
          const monthlyEntry = yearlyEntry.monthlyData.find(
            (entry) => entry.month === month
          );

          if (monthlyEntry) {
            yearlyEntry.totalIncome -= monthlyEntry.monthlyIncome;
            yearlyEntry.totalExpenses -= monthlyEntry.monthlyExpenses;
            // Month entry exists, update the totalIncome and totalExpenses
            monthlyEntry.monthlyExpenses = 0;
            monthlyEntry.monthlyIncome = 0;
          } else {
            res.status(200).json({
              success: true,
              message: "No monthly data found for this month and year",
              deleted: false,
            });
          }

          // Update the totalIncome and totalExpenses based on all monthly entries
          // yearlyEntry.totalIncome += parseInt(monthlyIncome);
          // yearlyEntry.totalExpenses += parseInt(monthlyExpense);
        } else {
          res.status(200).json({
            success: true,
            message: "No monthly data found for this month and year",
            deleted: false,
          });
        }
        await userData.save();
      }

      res.status(200).json({
        success: true,
        message: "Monthly data reset successfully",
        deleted: true,
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

// Express Route for updating projected yearly savings
router.post(
  "/update-projected-savings",
  detokenizeAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { projectedYearlySavings, year } = req.body;
      console.log(projectedYearlySavings, year, req.user);

      // Find the user's data entry for the specified year
      let userData = await MonthlyDataModel.findOne({ userId: req.user });

      if (!userData) {
        // User data not found, create a new entry
        userData = new MonthlyDataModel({
          userId: req.user,
          yearlyData: [
            {
              year: year,
              monthlyData: [],
              totalIncome: 0,
              totalExpenses: 0,
              projectedYearlySavings: projectedYearlySavings,
            },
          ],
        });
      } else {
        // Find the entry for the specified year within yearlyData array
        const yearlyEntry = userData.yearlyData.find(
          (entry) => entry.year === year
        );

        if (!yearlyEntry) {
          // Yearly entry not found, create a new one
          userData.yearlyData.push({
            year: year,
            projectedYearlySavings: projectedYearlySavings,
          } as YearlyData);
        } else {
          // Update the projected yearly savings
          yearlyEntry.projectedYearlySavings = projectedYearlySavings;
        }
      }

      // Save the changes
      await userData.save();

      res.status(200).json({
        success: true,
        message: "Projected yearly savings updated successfully.",
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
*/
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
        item,
        parsedDate.getMonth() + 1,
        parsedDate.getDate(),
        parsedDate.getFullYear()
      );
      const year = parsedDate.getFullYear();
      const month = monthNames[parsedDate.getMonth()];
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
        if (type === "actual") {
          if (itemType === "Income") {
            monthData.actual.income += income;
            monthlyData.yearlyData[yearIndex].totalActualIncome += income;
            monthData.actual.items.push({
              category: category,
              title: item,
              amount: income,
              type: itemType,
            });
          } else {
            monthData.actual.expense += expense;
            monthlyData.yearlyData[yearIndex].totalActualExpenses += expense;
            monthData.actual.items.push({
              category: category,
              title: item,
              amount: expense,
              type: itemType,
            });
          }
          // monthData.actual.items.push({category:category,title:itemName,amount:})
        } else if (type === "current") {
          if (itemType === "Income") {
            monthData.current.income += income;
            monthlyData.yearlyData[yearIndex].totalActualIncome += income;
            monthData.current.items.push({
              category: category,
              title: item,
              amount: income,
              type: itemType,
            });
          } else {
            monthData.current.expense += expense;
            monthlyData.yearlyData[yearIndex].totalActualExpenses += expense;
            monthData.current.items.push({
              category: category,
              title: item,
              amount: expense,
              type: itemType,
            });
          }
        } else if (type === "target") {
          if (itemType === "Income") {
            monthData.target.income += income;
            monthlyData.yearlyData[yearIndex].totalActualIncome += income;
            monthData.target.items.push({
              category: category,
              title: item,
              amount: income,
              type: itemType,
            });
          } else {
            monthData.target.expense += expense;
            monthlyData.yearlyData[yearIndex].totalActualExpenses += expense;
            monthData.target.items.push({
              category: category,
              title: item,
              amount: expense,
              type: itemType,
            });
          }
        }
      } else {
        // Insert new month's data
        const newData = {
          month,
          actual:
            type === "actual"
              ? {
                  income: income,
                  expense: expense,
                  items: [
                    {
                      category: category,
                      title: item,
                      amount: expense,
                      type: itemType,
                    },
                  ],
                }
              : { income: 0, expense: 0, items: [] },
          current:
            type === "current"
              ? {
                  income: income,
                  expense: expense,
                  items: [
                    {
                      category: category,
                      title: item,
                      amount: expense,
                      type: itemType,
                    },
                  ],
                }
              : { income: 0, expense: 0, items: [] },
          target:
            type === "target"
              ? {
                  income: income,
                  expense: expense,
                  items: [
                    {
                      category: category,
                      title: item,
                      amount: expense,
                      type: itemType,
                    },
                  ],
                }
              : { income: 0, expense: 0, items: [] },
        };

        console.log("inside else in ", newData, newData.actual.items);
        monthlyData.yearlyData[yearIndex].monthlyData.push(newData);
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

// Express Route for retrieving income items
router.get(
  "/get-list/:year/:month",
  detokenizeAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { month, year } = req.params;
      console.log(month, year);

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

      // Find the monthly entry for the specified month
      const monthlyEntry = yearlyEntry.monthlyData.find(
        (entry) => entry.month === month
      );

      if (!monthlyEntry) {
        return res.status(200).json({
          success: true,
          yearlyEntry,
          message: "No data found for the specified month.",
        });
      }
      res.status(200).json({
        success: true,
        yearlyEntry,
        monthlyEntry,
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
export default router;
