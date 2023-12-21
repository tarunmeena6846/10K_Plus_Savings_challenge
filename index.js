const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const moment = require("moment"); // Import the moment library
const dotenv = require("dotenv");

const app = express();
dotenv.config();
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const secretKey = process.env.JWT_SCERET;
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
  items: [
    {
      name: String,
      amount: Number,
      type: { type: String, enum: ["income", "expense"], required: true },
    },
  ],
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  imageUrl: String, // New field for image URL
});

const admin = mongoose.model("admin", adminSchema);
const MonthlyData = mongoose.model("MonthlyData", monthlyDataSchema);

mongoose
  .connect(process.env.MONGODB_URL, { dbName: "savingApp" })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

function detokenizeAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  // console.log("auth header ", authHeader);
  // console.log(authHeader);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    let user = jwt.verify(token, secretKey);

    if (user.role === "admin") {
      console.log(" username after detoken" + user.username);
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
  console.log("bIsAdminPresent" + bIsAdminPresent);
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

app.get("/admin/me", detokenizeAdmin, async (req, res) => {
  // const currentDate = new Date();
  if (req.user.username) {
    const bIsAdminPresent = await admin.findOne({
      username: req.user.username,
    });
    console.log(" bIsAdminPresent at /me route", bIsAdminPresent);
    if (bIsAdminPresent) {
      res.status(200).send({
        userEmail: bIsAdminPresent.username,
        imageUrl: bIsAdminPresent.imageUrl,
      });
    } else {
      res.status(401).send("unauthorised");
    }
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

app.post("/admin/change-user_details", detokenizeAdmin, async (req, res) => {
  const { username, newPassword, imageUrl } = req.body;

  try {
    // Find admin by username
    const bIsAdminPresent = await admin.findOne({ username: username });

    if (!bIsAdminPresent) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (newPassword) {
      bIsAdminPresent.password = newPassword;
    }

    if (imageUrl) {
      bIsAdminPresent.imageUrl = imageUrl;
    }
    // Save the updated admin
    await bIsAdminPresent.save();
    return res
      .status(200)
      .json({ message: "User Deatils changed successfully" });
  } catch (error) {
    console.error("Error changing details:", error);
    return res.status(500).json({ error: "Internal server error" });
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
      existingData.items = existingData.items.filter(
        (item) => item.type !== "income"
      );

      // Recalculate totalIncome after removing income items
      existingData.totalIncome = existingData.items
        .filter((item) => item.type === "income")
        .reduce((total, item) => total + item.amount, 0);

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
      console.log(
        "Inside existing data present at reset expense",
        existingData
      );
      existingData.items = existingData.items.filter(
        (item) => item.type !== "expense"
      );

      // Recalculate totalIncome after removing income items
      existingData.totalExpenses = existingData.items
        .filter((item) => item.type === "expense")
        .reduce((total, item) => total + item.amount, 0);

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

// Express Route for saving both income and expenses items
app.post("/admin/save-item", detokenizeAdmin, async (req, res) => {
  try {
    const { total, month, year, items, type } = req.body;
    console.log("Items at save items ", items);
    // Check if a document with the given month and year already exists
    const existingData = await MonthlyData.findOne({
      userId: currentUserId,
      month,
      year,
    });
    if (existingData) {
      // Document exists, update the items arra
      items.forEach((item) => {
        const existingItem = existingData.items.find(
          (existingItem) => existingItem.name === item.name
        );

        if (existingItem) {
          // Item found, increment the amount
          existingItem.amount += item.amount;
        } else {
          // Item not found, add it to the items array
          existingData.items.push(item);
        }
      });
      existingData[type === "income" ? "totalIncome" : "totalExpenses"] +=
        total;
      await existingData.save();
    } else {
      // Document doesn't exist, create a new one
      const newData = new MonthlyData({
        userId: currentUserId,
        month,
        year,
        totalIncome: type === "income" ? total : 0,
        totalExpenses: type === "expense" ? total : 0,
        items,
      });
      await newData.save();
    }

    res.status(201).json({
      success: true,
      message: "Item saved successfully",
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

// Express Route for retrieving income items
app.get("/admin/get-list/:year/:month", detokenizeAdmin, async (req, res) => {
  try {
    const { month, year } = req.params;
    // const currentUserId = req.decoded.userId;
    // Retrieve income items for the specified month and year
    const incomeItems = await MonthlyData.findOne({
      userId: currentUserId,
      month,
      year,
    });
    if (!incomeItems) {
      return res.status(404).json({
        success: false,
        message: "No income items found for the specified month and year.",
      });
    }

    res.status(200).json({
      success: true,
      items: incomeItems.items,
      totalIncome: incomeItems.totalIncome,
      totalExpenses: incomeItems.totalExpenses,
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
// Express Route for retrieving income and expense items for each month in a specified year
app.get("/admin/get-yearly-list/:year", detokenizeAdmin, async (req, res) => {
  try {
    const { year } = req.params;

    // Retrieve income and expense items for the specified year
    const monthlyItems = await MonthlyData.find({
      userId: currentUserId,
      year,
    });

    if (!monthlyItems || monthlyItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No income items found for the specified year.",
      });
    }
    const commonItems = [];
    let yearlyIncome = 0,
      yearlyExpense = 0;
    // Create a mapping for each month and initialize with zero values
    const monthlyDataMap = {
      January: { income: 0, expenses: 0 },
      February: { income: 0, expenses: 0 },
      March: { income: 0, expenses: 0 },
      April: { income: 0, expenses: 0 },
      May: { income: 0, expenses: 0 },
      June: { income: 0, expenses: 0 },
      July: { income: 0, expenses: 0 },
      August: { income: 0, expenses: 0 },
      September: { income: 0, expenses: 0 },
      October: { income: 0, expenses: 0 },
      November: { income: 0, expenses: 0 },
      December: { income: 0, expenses: 0 },
    };

    // Iterate through monthly items and update the mapping
    monthlyItems.forEach((monthlyItem) => {
      const monthKey = monthlyItem.month;
      monthlyDataMap[monthKey].income += monthlyItem.totalIncome;
      yearlyIncome += monthlyItem.totalIncome;
      yearlyExpense += monthlyItem.totalExpenses;
      monthlyDataMap[monthKey].expenses += monthlyItem.totalExpenses;
      monthlyItem.items.forEach((item) => {
        if (item.type === "expense") {
          // Check if the item is already in commonItems
          const existingIndex = commonItems.findIndex(
            (commonItem) => commonItem.name === item.name
          );

          if (existingIndex !== -1) {
            // If found, update its amount numerically
            commonItems[existingIndex].amount += item.amount;
          } else {
            // If not found, add it to commonItems
            commonItems.push({ name: item.name, amount: item.amount });
          }
        }
      });
    });

    // Convert the mapping to an array
    const monthlyDataArray = Object.entries(monthlyDataMap).map(
      ([month, values]) => ({
        month,
        income: values.income,
        expenses: values.expenses,
      })
    );

    res.status(200).json({
      success: true,
      items: monthlyDataArray,
      commonItems: commonItems,
      yearlyIncome: yearlyIncome,
      yearlyExpense: yearlyExpense,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
      yearlyIncome: 0,
      yearlyExpense: 0,
    });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
