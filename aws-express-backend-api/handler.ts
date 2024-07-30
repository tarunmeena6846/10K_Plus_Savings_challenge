import express from "express";
import mongoose, { Connection } from "mongoose";
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
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

let cachedDb: Connection | null = null;

const connectDB = async () => {
  if (cachedDb && cachedDb.readyState === 1) {
    console.log("Using existing MongoDB connection");
    return cachedDb;
  }
  console.log("Creating new MongoDB connection");
  console.log(process.env.MONGODB_URL);
  try {
    const mongooseInstance = await mongoose.connect(
      process.env.MONGODB_URL || "",
      {
        dbName: "savingApp",
        serverSelectionTimeoutMS: 30000, // Increase timeout
      }
    );

    cachedDb = mongooseInstance.connection;
    console.log("Connected to MongoDB");
    return cachedDb;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process with failure
  }
};

// Middleware to ensure the MongoDB connection is established
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Failed to connect to the database" });
  }
});

console.log("pointer till 27");
app.use("/auth", authRoutes);
app.use("/data", dataRoute);
app.use("/stripe", stripeRoutes);
app.use("/post", postRoute);
app.use("/swot", swotRoute);
app.use("/event", eventRoute);
app.use("/notification", reminder);

app.get("/", (req, res) => {
  console.log("health status check");
  return res.status(200).json({ message: "Server is up and running" });
});
console.log(process.env.AWS_LAMBDA_FUNCTION_NAME);
// Check if running locally or in Lambda environment
if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
  // If running in Lambda environment, export the serverless handler
  module.exports.handler = serverless(app);
} else {
  // If running locally, start the server on a specific port
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}
