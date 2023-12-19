const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const moment = require("moment"); // Import the moment library

const app = express();

// app.use(express.json());
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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

app.get("/admin/me", detokenizeAdmin, async (req, res) => {
  // const currentDate = new Date();
  console.log("tarun at me route", req.user.username, " ", currentUserId);
  if (req.user.username) {
    const bIsAdminPresent = await admin.findOne({
      username: req.user.username,
    });
    console.log("tarun bisadminpresent", bIsAdminPresent);
    if (bIsAdminPresent) {
      res.status(200).send({
        userEmail: bIsAdminPresent.username,
        imageUrl: bIsAdminPresent.imageUrl,
      });
    } else {
      res.status(401).send("unauthorised");
    }
    // const currentDate = new Date();
    // // Get total monthly data
    // MonthlyData.aggregate([
    //   {
    //     $match: {
    //       userId: currentUserId,
    //       month: currentDate.toLocaleString("en-US", { month: "long" }),
    //       year: currentDate.getFullYear(),
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       totalIncome: { $sum: "$totalIncome" },
    //       totalExpenses: { $sum: "$totalExpenses" },
    //     },
    //   },
    // ])
    //   .exec()
    //   .then((monthlyResult) => {
    //     // Get total yearly data
    //     MonthlyData.aggregate([
    //       {
    //         $match: {
    //           userId: currentUserId,
    //           year: currentDate.getFullYear(),
    //         },
    //       },
    //       {
    //         $group: {
    //           _id: null,
    //           totalYearlyIncome: { $sum: "$totalIncome" },
    //           totalYearlyExpenses: { $sum: "$totalExpenses" },
    //         },
    //       },
    //     ])
    //       .exec()
    //       .then((yearlyResult) => {
    //         const {
    //           totalIncome: monthlyTotalIncome,
    //           totalExpenses: monthlyTotalExpenses,
    //         } =
    //           monthlyResult.length > 0
    //             ? monthlyResult[0]
    //             : { totalIncome: 0, totalExpenses: 0 };
    //         const { totalYearlyIncome, totalYearlyExpenses } =
    //           yearlyResult.length > 0
    //             ? yearlyResult[0]
    //             : { totalYearlyIncome: 0, totalYearlyExpenses: 0 };
    //         const yearlySaving = totalYearlyIncome - totalYearlyExpenses;
    //         res.status(201).json({
    //           username: req.user.username,
    //           message: "Data retrieved successfully",
    //           monthlyData: {
    //             totalIncome: monthlyTotalIncome,
    //             totalExpenses: monthlyTotalExpenses,
    //           },
    //           yearlyData: {
    //             totalYearlyIncome,
    //             totalYearlyExpenses,
    //             yearlySaving,
    //           },
    //         });
    //       })
    //       .catch((err) => {
    //         console.error("Error fetching yearly data:", err);
    //         res.status(500).json({ message: "Internal Server Error" });
    //       });
    // })
    // .catch((err) => {
    //   console.error("Error fetching monthly data:", err);
    //   res.status(500).json({ message: "Internal Server Error" });
    // });
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
      // console.log("tarun data at each", data);
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
    console.log("tarun existing data ", existingData);
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
    console.log("tarun existing data at expense ", existingData);
    if (existingData) {
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
    console.log("tarun items are ", items, total);
    // Check if a document with the given month and year already exists
    const existingData = await MonthlyData.findOne({
      userId: currentUserId,
      month,
      year,
    });
    console.log("tarun existing data ", existingData);
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
    console.log("tarun month and year are ", month, year);
    // Retrieve income items for the specified month and year
    const incomeItems = await MonthlyData.findOne({
      userId: currentUserId,
      month,
      year,
    });
    console.log("tarun incomeItems", incomeItems);
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
// Express Route for retrieving common income items for a specified year
// app.get("/admin/get-yearly-list/:year", detokenizeAdmin, async (req, res) => {
//   try {
//     const { year } = req.params;
//     console.log("tarun year is", year);

//     // Retrieve income items for the specified year
//     const monthlyItems = await MonthlyData.find({
//       userId: currentUserId,
//       year,
//     });

//     if (!monthlyItems || monthlyItems.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No income items found for the specified year.",
//       });
//     }

//     // Aggregate and filter common items
//     const commonItems = monthlyItems.reduce((accumulator, monthlyItem) => {
//       monthlyItem.items.forEach((item) => {
//         if (item.type === "expense") {
//           const existingItem = accumulator.find(
//             (commonItem) => commonItem.name === item.name
//           );

//           if (existingItem) {
//             existingItem.amount += item.amount;
//           } else {
//             accumulator.push({ name: item.name, amount: item.amount });
//           }
//         }
//       });

//       return accumulator;
//     }, []);

//     res.status(200).json({
//       success: true,
//       items: commonItems,
//       // totalIncome: incomeItems.totalIncome,
//       // totalExpenses: incomeItems.totalExpenses,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// });

// Express Route for retrieving income and expense items for each month in a specified year
app.get("/admin/get-yearly-list/:year", detokenizeAdmin, async (req, res) => {
  try {
    const { year } = req.params;
    console.log("tarun year is", year);

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
      //   if (item.type === "income") {
      //     monthlyDataMap[monthKey].income += item.amount;
      //   } else if (item.type === "expense") {
      //     monthlyDataMap[monthKey].expenses += item.amount;

      //     // Check if the item is already in commonItems
      //     const existingItem = monthlyDataMap[monthKey].commonItems.find(
      //       (commonItem) => commonItem.name === item.name
      //     );

      //     if (existingItem) {
      //       existingItem.amount += item.amount;
      //     } else {
      //       // If not present, add it to commonItems
      //       monthlyDataMap[monthKey].commonItems.push({
      //         name: item.name,
      //         amount: item.amount,
      //       });
      //     }
      //   }
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
