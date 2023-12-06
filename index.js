const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const moment = require("moment"); // Import the moment library

const app = express();

app.use(express.json());
app.use(cors());

const secretKey = "mysecretkey";
let currentUserId;

const monthlyDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
  },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  totalIncome: { type: Number, default: 0 },
  totalExpenses: { type: Number, default: 0 },
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const admin = mongoose.model("admin", adminSchema);
const MonthlyData = mongoose.model("MonthlyData", monthlyDataSchema);

mongoose
  .connect(
    "mongodb+srv://tarunmeena6846:Tuesday6%5E@cluster0.f6tatpb.mongodb.net/",
    { dbName: "savingApp" }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// const db = client.db("savingApp");
// const expensesCollection = db.collection("expenses");

function detokenizeAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("auth header ", authHeader);
  console.log(authHeader);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    let user = jwt.verify(token, secretKey);

    if (user.role === "admin") {
      console.log("tarun at detoken" + user.username);
      req.user = user;
      next();
    } else {
      res.status(403).send("Unauthorised");
    }
  }
}
// Admin routes
app.post("/admin/signup", async (req, res) => {
  const bIsAdminPresent = await admin.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  console.log("tarun" + bIsAdminPresent);
  if (!bIsAdminPresent) {
    const obj = { username: req.body.username, password: req.body.password };
    console.log(obj);
    const newAdmin = new admin(obj);
    newAdmin.save();
    console.log(newAdmin._id);
    currentUserId = newAdmin._id;
    console.log(newAdmin);
    let token = jwt.sign(
      {
        username: req.body.username,
        role: "admin",
      },
      secretKey,
      { expiresIn: "1h" }
    );
    res.status(200).json({ content: "Admin created successfully", token });
  } else {
    res.status(401).send("Admin already registered");
  }
});

app.get("/admin/me", detokenizeAdmin, (req, res) => {
  const currentDate = new Date();
  console.log("tarun at me route", req.user.username, " ", currentUserId);
  if (req.user.username) {
    const currentDate = new Date();

    // Get total monthly data
    MonthlyData.aggregate([
      {
        $match: {
          userId: currentUserId,
          month: currentDate.toLocaleString("en-US", { month: "long" }),
          year: currentDate.getFullYear(),
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$totalIncome" },
          totalExpenses: { $sum: "$totalExpenses" },
        },
      },
    ])
      .exec()
      .then((monthlyResult) => {
        // Get total yearly data
        MonthlyData.aggregate([
          {
            $match: {
              userId: currentUserId,
              year: currentDate.getFullYear(),
            },
          },
          {
            $group: {
              _id: null,
              totalYearlyIncome: { $sum: "$totalIncome" },
              totalYearlyExpenses: { $sum: "$totalExpenses" },
            },
          },
        ])
          .exec()
          .then((yearlyResult) => {
            const {
              totalIncome: monthlyTotalIncome,
              totalExpenses: monthlyTotalExpenses,
            } =
              monthlyResult.length > 0
                ? monthlyResult[0]
                : { totalIncome: 0, totalExpenses: 0 };

            const { totalYearlyIncome, totalYearlyExpenses } =
              yearlyResult.length > 0
                ? yearlyResult[0]
                : { totalYearlyIncome: 0, totalYearlyExpenses: 0 };

            const yearlySaving = totalYearlyIncome - totalYearlyExpenses;

            res.status(201).json({
              username: req.user.username,
              message: "Data retrieved successfully",
              monthlyData: {
                totalIncome: monthlyTotalIncome,
                totalExpenses: monthlyTotalExpenses,
              },
              yearlyData: {
                totalYearlyIncome,
                totalYearlyExpenses,
                yearlySaving,
              },
            });
          })
          .catch((err) => {
            console.error("Error fetching yearly data:", err);
            res.status(500).json({ message: "Internal Server Error" });
          });
      })
      .catch((err) => {
        console.error("Error fetching monthly data:", err);
        res.status(500).json({ message: "Internal Server Error" });
      });
  } else {
    res.status(401).send("Unauthorised");
  }
});
// TODO add the below logic to a common place for the autentcation
app.post("/admin/login", async (req, res) => {
  const bIsAdminPresent = await admin.findOne({
    username: req.headers.username,
    password: req.headers.password,
  });

  if (bIsAdminPresent) {
    currentUserId = bIsAdminPresent._id;
    const token = jwt.sign(
      { username: req.headers.username, role: "admin" },
      secretKey,
      { expiresIn: "1h" }
    );
    res.status(200).send({ content: "Login successfully", token });
  } else {
    res.status(401).send("unauthorised");
  }
});

app.post("/admin/save-expense", detokenizeAdmin, async (req, res) => {
  try {
    const { total, month, year } = req.body;
    console.log("tarun items are ", total, month, year);
    // const currentDate = new Date();
    const DatePresent = await MonthlyData.findOne({
      userId: currentUserId,
      // month: currentDate.toLocaleString("en-US", { month: "long" }),
      // year: currentDate.getFullYear(),
      month: month,
      //   year: currentDate.getFullYear(),
      year: year,
    });
    console.log("tarun", DatePresent);
    console.log("tarun ", currentUserId);
    if (DatePresent) {
      await MonthlyData.updateOne(
        {
          userId: currentUserId,
          year: year,
          month: month,
          // year: currentDate.getFullYear(),
          // month: currentDate.toLocaleString("en-US", { month: "long" }),
        },
        { $inc: { totalExpenses: total } }
      );
    } else {
      const newExpense = new MonthlyData({
        userId: currentUserId,
        totalExpenses: total,
        year: year,
        month: month,
        // month: currentDate.toLocaleString("en-US", { month: "long" }),
        // year: currentDate.getFullYear(),
      });
      await newExpense.save();
    }
    //todo remove this
    MonthlyData.aggregate([
      {
        $match: {
          userId: currentUserId,
          year: year,
          month: month,
          // year: currentDate.getFullYear(),
          // month: currentDate.toLocaleString("en-US", { month: "long" }),
        },
      },
      {
        $group: {
          _id: null,
          // totalIncome: { $sum: '$totalIncome' },
          totalExpenses: { $sum: "$totalExpenses" },
        },
      },
    ])
      .exec()
      .then((result) => {
        if (result.length > 0) {
          const { totalExpenses } = result[0];
          //   console.log("Total Income:", totalIncome);
          console.log("Total Expenses:", totalExpenses);
          res.status(201).json({
            success: true,
            message: "Expense saved successfully",
            totalExpenses: totalExpenses,
          });
        } else {
          console.log("No data found for the user.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    // res
    //   .status(201)
    //   .json({ success: true, message: "Expense saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
app.post("/admin/save-income", detokenizeAdmin, async (req, res) => {
  try {
    const { total, month, year } = req.body;
    console.log("tarun items are ", total, month, year);
    const currentDate = new Date();
    const DatePresent = await MonthlyData.findOne({
      userId: currentUserId,
      //   month: currentDate.toLocaleString("en-US", { month: "long" }),
      month: month,
      //   year: currentDate.getFullYear(),
      year: year,
    });
    console.log("tarun", DatePresent);
    console.log("tarun ", currentUserId);
    if (DatePresent) {
      await MonthlyData.updateOne(
        {
          userId: currentUserId,
          //   year: currentDate.getFullYear(),
          //   month: currentDate.toLocaleString("en-US", { month: "long" }),
          month: month,
          //   year: currentDate.getFullYear(),
          year: year,
        },
        { $inc: { totalIncome: total } }
      );
    } else {
      const newIncome = new MonthlyData({
        userId: currentUserId,
        totalIncome: total,
        // month: currentDate.toLocaleString("en-US", { month: "long" }),
        // year: currentDate.getFullYear(),
        month: month,
        //   year: currentDate.getFullYear(),
        year: year,
      });
      await newIncome.save();
    }
    //TODO remove this
    MonthlyData.aggregate([
      {
        $match: {
          userId: currentUserId,
          //   year: currentDate.getFullYear(),
          //   month: currentDate.toLocaleString("en-US", { month: "long" }),
          month: month,
          //   year: currentDate.getFullYear(),
          year: year,
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$totalIncome" },
          // totalExpenses: { $sum: "$totalExpenses" },
        },
      },
    ])
      .exec()
      .then((result) => {
        if (result.length > 0) {
          const { totalIncome } = result[0];
          console.log("Total Income:", totalIncome);
          //   console.log("Total Expenses:", totalExpenses);
          res.status(201).json({
            success: true,
            message: "Income saved successfully",
            totalIncome: totalIncome,
          });
        } else {
          console.log("No data found for the user.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    // res
    //   .status(201)
    //   .json({ success: true, message: "Income saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

app.get("/admin/monthly-data", detokenizeAdmin, async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    // const currentUserId = req.userId; // Assuming you have the userId in the req object

    // Fetch existing monthly data
    const existingMonthlyData = await MonthlyData.find({
      userId: currentUserId,
      year: currentYear,
    });
    console.log("tarun existing monthlydatat", existingMonthlyData);
    // Create a map for easy access to existing data
    const existingDataMap = {};
    existingMonthlyData.forEach((data) => {
      console.log("tarun data at each", data);
      existingDataMap[data.month] = data;
    });

    // Create an array to store the final monthly data
    const monthlyData = [];

    // Iterate over all months and either fetch existing data or insert new data
    for (let month = 1; month <= 12; month++) {
      const fullMonthName = moment()
        .month(month - 1)
        .format("MMMM"); // Get full month name

      const existingData = existingDataMap[fullMonthName];

      if (existingData) {
        // If data exists for the month, add it to the final array
        monthlyData.push(existingData);
      } else {
        // If data doesn't exist, insert a new record with values set to 0
        const newRecord = {
          userId: currentUserId,
          year: currentYear,
          month: fullMonthName,
          totalIncome: 0,
          totalExpenses: 0,
          // Add other fields as needed
        };

        // Insert the new record
        const insertedData = await MonthlyData.create(newRecord);

        // Add the inserted data to the final array
        monthlyData.push(insertedData);
      }
    }

    res.status(200).json({
      success: true,
      message: "Monthly data for the current year retrieved successfully",
      data: monthlyData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

app.post("/admin/reset-monthly-income", async (req, res) => {
  try {
    const { month, year } = req.body;

    // Check if data already exists for the given month and year
    const existingData = await MonthlyData.findOne({
      userId: currentUserId, // Assuming you have user authentication middleware
      month,
      year,
    });

    if (existingData) {
      // Reset data
      existingData.totalIncome = 0;
      // existingData.totalExpenses = 0;
      await existingData.save();
    }

    res.status(200).json({
      success: true,
      message: "Monthly data reset successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

app.post("/admin/reset-monthly-expenses", async (req, res) => {
  try {
    const { month, year } = req.body;

    // Check if data already exists for the given month and year
    const existingData = await MonthlyData.findOne({
      userId: currentUserId, // Assuming you have user authentication middleware
      month,
      year,
    });

    if (existingData) {
      // Reset data
      // existingData.totalIncome = 0;
      existingData.totalExpenses = 0;
      await existingData.save();
    }
    res.status(200).json({
      success: true,
      message: "Monthly data reset successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
