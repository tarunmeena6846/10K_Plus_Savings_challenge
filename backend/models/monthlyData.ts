import mongoose, { Document, Schema } from "mongoose";

interface MonthlyData extends Document {
  userId: string;
  yearlyData: Array<YearlyData>;
}

export interface YearlyData {
  year: number;
  monthlyData: Array<MonthlyEntry>;
  totalIncome: number;
  totalExpenses: number;
  projectedYearlySavings: number;
}

interface MonthlyEntry {
  month: string;
  monthlyIncome: number;
  monthlyExpenses: number;
}

const monthlyDataSchema = new Schema<MonthlyData>({
  userId: {
    type: String,
    ref: "Admin",
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
        },
      ],
      totalIncome: { type: Number, default: 0 },
      totalExpenses: { type: Number, default: 0 },
      projectedYearlySavings: { type: Number, default: 0 },
    },
  ],
});

const MonthlyDataModel = mongoose.model<MonthlyData>(
  "MonthlyData",
  monthlyDataSchema
);

export default MonthlyDataModel;
