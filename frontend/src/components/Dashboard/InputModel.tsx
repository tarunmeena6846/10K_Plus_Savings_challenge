import React, { useState } from "react";
import { Modal, Button } from "@mui/material";
import TextFieldWithDropdown from "../community/InputField";
import CancelButton from "../community/Cancelbutton";

const AddTransactionModal = ({
  isOpen,
  onClose,
  onAddIncome,
  onAddExpense,
  activeTab,
  type,
  setAction,
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
    onAddIncome(newItem, newCategory, newAmount, newDate, type, setAction);
    setNewItem("");
    setNewCategory("");
    setNewAmount(0);
    setNewDate(null);
    onClose();
  };

  const handleAddExpense = () => {
    console.log(newItem, newAmount);
    onAddExpense(newItem, newCategory, newAmount, newDate, type, setAction);
    setNewItem("");
    setNewCategory("");
    setNewAmount(0);
    setNewDate(null);
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
        flexDirection: "row",
        // margin: "4px",
      }}
    >
      <div className="flex flex-col bg-white rounded-3xl w-[900px]">
        <div className="flex items-center justify-between p-6 py-4">
          <h2 className="text-2xl">
            {activeTab === 0 ? "New Income" : "New Expense"}
          </h2>
          <CancelButton onClose={onClose} />
        </div>
        <hr />
        <div className="p-6 flex flex-row justify-center w-full">
          <div className="w-full">
            <h1 className="px-1">Item*</h1>
            <input
              type="text"
              placeholder="Item"
              className="w-full border border-gray-300 px-4 py-2 my-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
              // style={{
              //   marginBottom: "10px",
              //   width: "100%",
              //   padding: "8px",
              //   boxSizing: "border-box",
              // }}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />
            <h1 className="px-1">Date*</h1>
            <input
              type="date"
              placeholder="Date"
              className="w-full border border-gray-300 px-4 py-2 my-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <h1 className="px-1">Amount*</h1>
            <input
              type="number"
              placeholder="Amount"
              className="w-full border border-gray-300 px-4 py-2 my-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
              value={newAmount}
              onChange={(e) => setNewAmount(parseFloat(e.target.value))}
            />
            <h1 className="px-1">Category*</h1>
            <TextFieldWithDropdown
              setProp={setNewCategory}
              prop={newCategory}
              propValues={
                activeTab === 0 ? incomeCategories : expenseCategories
              }
              placeholder={"Category"}
            />
          </div>

          <div className="border m-2 p-5 rounded-3xl w-1/2 ml-[70px]">
            <img
              src="./IncomemodalImage.png"
              className=" rounded-3xl mx-10 h-[200px]"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={activeTab === 0 ? handleAddIncome : handleAddExpense}
            className="bg-green-500 p-4 rounded m-5 rounded-3xl text-white hover:bg-green-800"
          >
            {activeTab === 0 ? "Add Income" : "Add Expense"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddTransactionModal;
