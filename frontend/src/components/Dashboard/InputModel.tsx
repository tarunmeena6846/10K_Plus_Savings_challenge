import React, { useState } from "react";
import { Modal, Button } from "@mui/material";
import TextFieldWithDropdown from "../community/InputField";

const AddTransactionModal = ({
  isOpen,
  onClose,
  onAddIncome,
  onAddExpense,
  activeTab,
  type,
}) => {
  const [newItem, setNewItem] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState(0);
  const [newDate, setNewDate] = useState(Date);

  const expenseCategories = [
    "Housing",
    "Transportation",
    "Food",
    "Health and Fitness",
    "Education",
    "Entertainment",
    "Personal Care",
    "Debt Repayment",
    "Savings and Investments",
    "Miscellaneous",
  ];

  const incomeCategories = [
    "Salary/Wages",
    "Business Income",
    "Investment Income",
    "Government Benefits",
    "Other Income",
  ];

  const handleAddIncome = () => {
    onAddIncome(newItem, newCategory, newAmount, newDate, type);
    onClose();
  };

  const handleAddExpense = () => {
    console.log(newItem, newAmount);
    onAddExpense(newItem, newCategory, newAmount, newDate, type);

    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "400px",
        }}
      >
        <h2>{activeTab === 0 ? "New Income" : "New Expense"}</h2>
        <input
          type="text"
          placeholder="Item"
          className="w-full border border-gray-300 px-4 py-2 my-2 rounded-md focus:outline-none focus:border-blue-500"
          // style={{
          //   marginBottom: "10px",
          //   width: "100%",
          //   padding: "8px",
          //   boxSizing: "border-box",
          // }}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <TextFieldWithDropdown
          setProp={setNewCategory}
          prop={newCategory}
          propValues={activeTab === 0 ? incomeCategories : expenseCategories}
          placeholder={"Category"}
        />
        {/* <input
          type="text"
          placeholder="Category"
          style={{
            marginBottom: "10px",
            width: "100%",
            padding: "8px",
            boxSizing: "border-box",
          }}
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        /> */}
        <input
          type="date"
          placeholder="Date"
          className="w-full border border-gray-300 px-4 py-2 my-2 rounded-md focus:outline-none focus:border-blue-500"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          className="w-full border border-gray-300 px-4 py-2 my-2 rounded-md focus:outline-none focus:border-blue-500"
          value={newAmount}
          onChange={(e) => setNewAmount(parseFloat(e.target.value))}
        />
        <Button onClick={activeTab === 0 ? handleAddIncome : handleAddExpense}>
          {activeTab === 0 ? "Add Income" : "Add Expense"}
        </Button>
      </div>
    </Modal>
  );
};

export default AddTransactionModal;
