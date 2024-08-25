import mongoose, { Schema, Document } from "mongoose";

interface Item {
  category: string;
  title: string;
  amount: number;
  type: string;
  date: Date;
}

export interface MonthlyData {
  month: string;
  actual: {
    income: number;
    expense: number;
    items: Item[];
  };
  current: {
    income: number;
    expense: number;
    items: Item[];
  };
  target: {
    income: number;
    expense: number;
    items: Item[];
  };
}

interface YearlyData {
  year: number;
  monthlyData: MonthlyData[];
  totalActualIncome: number;
  totalActualExpenses: number;
  totalCurrentIncome: number;
  totalCurrentExpenses: number;
  totalTargetIncome: number;
  totalTargetExpenses: number;
}

interface MonthlyDataSchemaDocument extends Document {
  userId: string;
  yearlyData: YearlyData[];
}

const itemSchema = new Schema<Item>({
  category: { type: String },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  date: { type: Date },
});

const monthlyDataSchema = new Schema<MonthlyDataSchemaDocument>({
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
          actual: {
            income: { type: Number, default: 0 },
            expense: { type: Number, default: 0 },
            items: [itemSchema],
          },
          current: {
            income: { type: Number, default: 0 },
            expense: { type: Number, default: 0 },
            items: [itemSchema],
          },
          target: {
            income: { type: Number, default: 0 },
            expense: { type: Number, default: 0 },
            items: [itemSchema],
          },
        },
      ],
      totalActualIncome: { type: Number, default: 0 },
      totalActualExpenses: { type: Number, default: 0 },
      totalCurrentIncome: { type: Number, default: 0 },
      totalCurrentExpenses: { type: Number, default: 0 },
      totalTargetIncome: { type: Number, default: 0 },
      totalTargetExpenses: { type: Number, default: 0 },
    },
  ],
});

export default mongoose.model<MonthlyDataSchemaDocument>(
  "MonthlyData",
  monthlyDataSchema
);
