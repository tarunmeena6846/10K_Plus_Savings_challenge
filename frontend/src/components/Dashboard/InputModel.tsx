import React, { useState } from "react";
import { Modal, Button } from "@mui/material";

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
          style={{
            marginBottom: "10px",
            width: "100%",
            padding: "8px",
            boxSizing: "border-box",
          }}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <input
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
        />
        <input
          type="date"
          placeholder="Date"
          style={{
            marginBottom: "10px",
            width: "100%",
            padding: "8px",
            boxSizing: "border-box",
          }}
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          style={{
            marginBottom: "10px",
            width: "100%",
            padding: "8px",
            boxSizing: "border-box",
          }}
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
