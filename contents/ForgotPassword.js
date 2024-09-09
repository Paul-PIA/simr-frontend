import React, { useState } from "react";
import { apiClientNotoken } from "../services/api";

export default function ForgotPassword() {
  return (
    <div>
      <div className="auth-form">
        <h2>Forgot Password</h2>
        <form 
  name="forgot" 
  onSubmit={(e) => {
    e.preventDefault();
    apiClientNotoken({
      method: 'POST',
      path: 'auth/forgotpassword/',
      data: {
        email: document.forgot.email.value,
      }
    });
  }}
>
          <label>
            <input
              type="email"
              name="email"
              placeholder="Email adress"
              required
            />
          </label>
          <button type="submit">Send email</button>
        </form>
      </div>
      <style jsx="true">{`
        .auth-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 30px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 400px;
          max-width: 90%;
        }
        .auth-form input {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        .auth-form button {
          width: 100%;
          padding: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .auth-form button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}
