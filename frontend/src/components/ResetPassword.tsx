import { Card } from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Error matching passwords please try again");
      return;
    }
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      }
    );
    const data = await response.json();
    alert(data.message);

    if (data.success) {
      navigate("/login");
    }
  };

  return (
    <div style={{ backgroundColor: "#F0F0F0", minHeight: "100vh" }}>
      <div
        style={{
          paddingTop: 120,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <h2 className="text-xl">Reset password</h2>
      </div>
      <div style={{ display: "flex", justifyContent: "center", padding: 10 }}>
        <Card variant="outlined" style={{ width: 400, padding: 20 }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                className="mt-1 p-2 w-full border rounded"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                className="mt-1 p-2 w-full border rounded"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Reset Password
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default ResetPassword;
