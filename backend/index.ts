// src/app.ts
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// import dotenv from "dotenv";
// import admi from "./routes/admin.routes";
import dataRoute from "./routes/dataRoute";
import authRoutes from "./routes/authRoutes";
import stripeRoutes from "./routes/stripeRoutes"; // Import the webhook routes
import postRoute from "./routes/postRoute";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

mongoose
  .connect(process.env.MONGODB_URL || "", {
    dbName: "savingApp",
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
console.log("pointer till 27");
app.use("/auth", authRoutes);
app.use("/data", dataRoute);
app.use("/stripe", stripeRoutes);
app.use("/post", postRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
