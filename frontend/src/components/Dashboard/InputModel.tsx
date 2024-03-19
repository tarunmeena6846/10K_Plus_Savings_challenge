import React, { useState } from "react";
import { Modal, Button, Tabs, Tab } from "@mui/material";

const AddTransactionModal = ({
  isOpen,
  onClose,
  onAddIncome,
  onAddExpense,
  activeTab,
}) => {
  const handleAddIncome = () => {
    // Call the onAddIncome function passed from the parent component
    onAddIncome();
  };

  const handleAddExpense = () => {
    // Call the onAddExpense function passed from the parent component
    onAddExpense();
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
        {activeTab === 0 && (
          <div>
            <h2>New Income</h2>
            <input
              type="text"
              placeholder="Item *"
              style={{
                marginBottom: "10px",
                width: "100%",
                padding: "8px",
                boxSizing: "border-box",
              }}
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
            />
            <Button onClick={handleAddIncome}>Add Income</Button>
          </div>
        )}
        {activeTab === 1 && (
          <div>
            <h2>New Expense</h2>
            <input
              type="text"
              placeholder="Item *"
              style={{
                marginBottom: "10px",
                width: "100%",
                padding: "8px",
                boxSizing: "border-box",
              }}
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
            />
            <Button onClick={handleAddExpense}>Add Expense</Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddTransactionModal;
