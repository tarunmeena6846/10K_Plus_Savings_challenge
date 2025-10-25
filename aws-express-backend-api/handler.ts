import express from "express";
import cors from "cors";
import dataRoute from "./routes/dataRoute";
import authRoutes from "./routes/authRoutes";
import stripeRoutes from "./routes/stripeRoutes";
import postRoute from "./routes/postRoute";
import swotRoute from "./routes/swotRoute";
import serverless from "serverless-http";
import dotenv from "dotenv";
import eventRoute from "./routes/eventRoute";
import reminder from "./routes/reminders";
import { createTables } from "./config/dynamodb";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize DynamoDB tables
let tablesInitialized = false;

export const initializeDynamoDB = async () => {
  if (tablesInitialized) {
    return;
  }

  try {
    await createTables();
    tablesInitialized = true;
    console.log("DynamoDB tables initialized");
  } catch (err) {
    console.error("Error initializing DynamoDB:", err);
    throw err;
  }
};

// Middleware to ensure DynamoDB is initialized
app.use(async (req, res, next) => {
  try {
    await initializeDynamoDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Failed to initialize database" });
  }
});

app.use("/auth", authRoutes);
app.use("/data", dataRoute);
// app.use("/stripe", stripeRoutes);
app.use("/post", postRoute);
app.use("/swot", swotRoute);
// app.use("/event", eventRoute);
app.use("/notification", reminder);

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Server is up and running",
    database: "DynamoDB",
    timestamp: new Date().toISOString()
  });
});

// Check if running locally or in Lambda environment
if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
  // If running in Lambda environment, export the serverless handler
  module.exports.handler = serverless(app);
} else {
  // If running locally, start the server on a specific port
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log("Using DynamoDB as database");
  });
}
