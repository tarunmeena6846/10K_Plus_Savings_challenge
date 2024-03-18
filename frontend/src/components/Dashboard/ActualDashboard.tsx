import React from "react";
import SidebarLayout from "../SidebarLayout";
import { monthIncExpInfo } from "../Dashboard";
import { Button } from "@mui/material";

export default function ActualDashboard() {
  return (
    <div>
      <SidebarLayout>
        <div className="grid grid-cols-1 md:grid-rows-3 md:grid-cols-3 gap-4">
          <div
            className="p-6 rounded-2xl"
            style={{ background: "#ffcbfb", overflow: "hidden" }}
          >
            <h2>Actual Income</h2>
            <h2 className="text-4xl">$0</h2>
          </div>
          <div
            className="p-6 rounded-2xl"
            style={{ background: "#b2edff", overflow: "hidden" }}
          >
            <h2>Actual Expenses</h2>
            <h2 className="text-4xl">$0</h2>
          </div>
          <div
            className="p-6 rounded-2xl"
            style={{ background: "#ceffae", overflow: "hidden" }}
          >
            <h2>Actual Savings</h2>
            <h2 className="text-4xl">$0</h2>
          </div>
          <div className="md:col-span-3 grid grid-cols-4 row-span-2 gap-4">
            <div
              className="pt-6 md:col-span-2 flex flex-col items-center rounded-2xl"
              style={{ background: "white", overflow: "hidden" }}
            >
              <h2 className="mb-4 text-center">Actual Income</h2>
              <Button
                style={{
                  minWidth: "100px",
                  color: "green",
                  border: "2px dotted green",
                  borderRadius: "20px",
                  margin: "10px",
                  textTransform: "none",
                }}
                variant="outlined"
                // onClick={() => ("/monthlyIncome")}
              >
                + Add Income
              </Button>
              {/* Render the updated items */}
              {monthIncExpInfo.length > 0 ? (
                <div style={{ padding: "10px", width: "100%" }}>
                  {monthIncExpInfo
                    .filter((item) => item.type === "income")
                    .map((item, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor: "#b6ff8b",
                          padding: "8px",
                          margin: "10px",
                          borderRadius: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ flex: 1 }}>{item.name}</span>
                        <span>
                          $
                          {item.amount.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    ))}
                </div>
              ) : null}
            </div>

            <div
              className="pt-6 md:col-span-2 flex flex-col items-center rounded-2xl"
              style={{ background: "white", overflow: "hidden" }}
            >
              <h2 className="mb-4 text-center">Actual Expenses</h2>
              <Button
                style={{
                  minWidth: "100px",
                  color: "green",
                  border: "2px dotted green",
                  borderRadius: "20px",
                  margin: "10px",
                  textTransform: "none",
                }}
                variant="outlined"
                //   onClick={() => navigate("/monthlyIncome")}
              >
                + Add Expenses
              </Button>
              {/* Render the updated items */}
              {monthIncExpInfo.length > 0 ? (
                <div style={{ padding: "10px", width: "100%" }}>
                  {monthIncExpInfo
                    .filter((item) => item.type === "expense")
                    .map((item, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor: "#b6ff8b",
                          padding: "8px",
                          margin: "10px",
                          borderRadius: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ flex: 1 }}>{item.name}</span>
                        <span>
                          $
                          {item.amount.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </SidebarLayout>
    </div>
  );
}
