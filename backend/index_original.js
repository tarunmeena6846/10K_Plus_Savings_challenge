const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
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
    type: String,
    ref: "admin",
    required: true,
    unique: true,
  },
  yearlyData: [
    {
      year: { type: Number, required: true },
      monthlyData: [
        {
          month: { type: String, required: true },
          monthlyIncome: { type: Number, default: 0 },
          monthlyExpenses: { type: Number, default: 0 },
          // Add other monthly fields as needed
        },
      ],
      totalIncome: { type: Number, default: 0 },
      totalExpenses: { type: Number, default: 0 },
      projectedYearlySavings: { type: Number, default: 0 },
      // Add other yearly fields as needed
    },
  ],
});

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
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
      currentUserId = user.username;
      next();
    } else {
      res.status(403).send("Unauthorised");
    }
  }
}
// Admin routes
app.post("/admin/signup", async (req, res) => {
  if (req.body.username) {
  }
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
    currentUserId = newAdmin.username;
    console.log(newAdmin);
    let token = jwt.sign(
      {
        username: req.body.username,
        role: "admin",
      },
      secretKey,
      { expiresIn: "1h" }
    );
    res
      .status(200)
      .json({ content: "Admin created successfully", token, success: true });
  } else {
    res
      .status(200)
      .send({ content: "Admin already registered", success: false });
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
    currentUserId = bIsAdminPresent.username;
    const token = jwt.sign(
      { username: req.headers.username, role: "admin" },
      secretKey,
      { expiresIn: "1h" }
    );
    res
      .status(200)
      .send({ content: "Login successfully", token, success: true });
  } else {
    res.status(401).send({ message: "unauthorised", success: false });
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

    // if (imageUrl) {
    bIsAdminPresent.imageUrl = imageUrl;
    // }
    // Save the updated admin
    await bIsAdminPresent.save();
    return res
      .status(200)
      .json({ message: "User Deatils changed successfully", success: true });
  } catch (error) {
    console.error("Error changing details:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
});
app.post("/admin/reset-monthly-data", detokenizeAdmin, async (req, res) => {
  try {
    const { month, year } = req.body;
    // currentUserId = req.user._id;
    console.log("req.user.username at 2", req.user.username, currentUserId);

    const userData = await MonthlyData.findOne({
      userId: currentUserId,
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
          yearlyEntry.totalIncome -= parseInt(monthlyEntry.monthlyIncome);
          yearlyEntry.totalExpenses -= parseInt(monthlyEntry.monthlyExpenses);
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
    }

    await userData.save();

    res.status(200).json({
      success: true,
      message: "Monthly data reset successfully",
      deleted: true,
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
// Express Route for updating projected yearly savings
app.post(
  "/admin/update-projected-savings",
  detokenizeAdmin,
  async (req, res) => {
    try {
      const { projectedYearlySavings, year } = req.body;
      console.log(projectedYearlySavings, year, currentUserId);

      // Find the user's data entry for the specified year
      let userData = await MonthlyData.findOne({ userId: currentUserId });

      if (!userData) {
        // User data not found, create a new entry
        userData = new MonthlyData({
          userId: currentUserId,
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
            year,
            projectedYearlySavings,
          });
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
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
);

app.post("/admin/save-item", detokenizeAdmin, async (req, res) => {
  try {
    const { month, year, monthlyIncome, monthlyExpense } = req.body;
    console.log("at save item", monthlyIncome, monthlyExpense);

    // Find the user's data
    const userData = await MonthlyData.findOne({
      userId: currentUserId,
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
    console.log(month, year);

    const userData = await MonthlyData.findOne({ userId: currentUserId });
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
        // projectedYearlySavings: yearlyEntry.projectedYearlySavings,
        // yearlyTotalIncome: yearlyEntry.totalIncome,
        // yearlyTotalExpenses: yearlyEntry.totalExpenses,
      });
    }
    res.status(200).json({
      success: true,
      yearlyEntry,
      monthlyEntry,
      // userData,
      // monthlyIncome: monthlyEntry.monthlyIncome,
      // monthlyExpenses: monthlyEntry.monthlyExpenses,
      // projectedYearlySavings: yearlyEntry.projectedYearlySavings,
      // yearlyTotalIncome: yearlyEntry.totalIncome,
      // yearlyTotalExpenses: yearlyEntry.totalExpenses,
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
