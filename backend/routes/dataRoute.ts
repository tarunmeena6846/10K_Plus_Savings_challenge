// src/routes/monthlyData.routes.ts
import express, { Router, Response } from "express";
// import MonthlyDataModel from "../models/monthlyData.model";
import MonthlyDataModel from "../models/monthlyData";
// import { detokenizeAdmin } from "../middleware/auth.middleware";
import { detokenizeAdmin } from "../middleware/index";
import { AuthenticatedRequest } from "../middleware/index";
import { YearlyData } from "../models/monthlyData";
import Stripe from "stripe";
import { Error } from "mongoose";

const stripe = new Stripe(process.env.STRIPE_KEY as string);
const router: Router = express.Router();

// async createSubscription(createSubscriptionRequest) {

// }

router.post(
  "/create-subscription",
  // detokenizeAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Create a Stripe customer
      const customer = await stripe.customers.create({
        name: req.body.name,
        email: req.body.email,
        payment_method: req.body.paymentMethod,
        invoice_settings: {
          default_payment_method: req.body.paymentMethod,
        },
      });
      console.log("customer", customer);
      // Create a subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: req.body.priceId }],
        payment_settings: {
          payment_method_options: {
            card: {
              request_three_d_secure: "any",
            },
          },
          payment_method_types: ["card"],
          save_default_payment_method: "on_subscription",
        },
        expand: ["latest_invoice.payment_intent"],
      });

      console.log("subscription", subscription);
      const invoice = subscription.latest_invoice as Stripe.Invoice;
      console.log("invoice", invoice);
      if (invoice.payment_intent) {
        const intent = invoice.payment_intent as Stripe.PaymentIntent;
        res.status(200).json({
          error: false,
          message: "Subsscription created sucessfully",
          data: {
            subscriptionId: subscription.id,
            clientSecret: intent.client_secret,
          },
        });
        // res.send({
        //   subscriptionId: subscription.id,
        //   clientSecret: intent.client_secret,
        // });
      }
      // Return the subscription details
      // res.status(200).json({
      //   error: false,
      //   message: "Subsscription created sucessfully",
      //   data: {
      //     clientSecret:
      //       subscription.latest_invoice?.payment_intent?.clientSecret,
      //     subscriptionId: subscription.id,
      //   },
      // });
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ error: "Failed to create subscription" });
    }
  }
);

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

router.post(
  "/save-item",
  detokenizeAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { month, year, monthlyIncome, monthlyExpense } = req.body;
      console.log("at save item", monthlyIncome, monthlyExpense);

      // Find the user's data
      const userData = await MonthlyDataModel.findOne({
        userId: req.user,
      });

      if (userData) {
        // User entry exists, find the yearly entry for the specified year
        const yearlyEntry = userData.yearlyData.find(
          (entry) => entry.year === year
        );

        if (yearlyEntry) {
          // Year entry exists, find the monthly entry for the specified month
          const monthlyEntry = yearlyEntry.monthlyData.find(
            (entry) => entry.month === month
          );

          if (monthlyEntry) {
            // Month entry exists, update the totalIncome and totalExpenses
            monthlyEntry.monthlyExpenses += parseInt(monthlyExpense);
            monthlyEntry.monthlyIncome += parseInt(monthlyIncome);
          } else {
            // Month entry doesn't exist, create a new one
            yearlyEntry.monthlyData.push({
              month,
              monthlyIncome,
              monthlyExpenses: monthlyExpense,
            });
          }

          // Update the totalIncome and totalExpenses based on all monthly entries
          yearlyEntry.totalIncome += parseInt(monthlyIncome);
          yearlyEntry.totalExpenses += parseInt(monthlyExpense);
        } else {
          // Year entry doesn't exist, create a new yearly entry with the monthly data
          userData.yearlyData.push({
            year,
            monthlyData: [
              {
                month,
                monthlyIncome,
                monthlyExpenses: monthlyExpense,
              },
            ],
            totalIncome: monthlyIncome,
            totalExpenses: monthlyExpense,
            projectedYearlySavings: 0,
          });
        }

        // Save the changes
        await userData.save();
      } else {
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
