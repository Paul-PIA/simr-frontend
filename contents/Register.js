import React, { useState } from "react";

export default function Register() {
  return (
    <div>
      <div className="auth-form">
        <h2>Register</h2>
        <form>
          <label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
            />
          </label>
          <label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
          </label>
          <label>
            <input
              type="password"
              name="password"
              placeholder="Repeat password"
              required
            />
          </label>
          <button type="submit">Register</button>
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
        .auth-links {
          display: flex;
          justify-content: space-between;
          width: 100%;
          font-size: 14px;
          margin-top: 15px;
        }
        .auth-links a {
          color: #007bff;
          text-decoration: none;
          margin: 0 10px;
          transition: color 0.3s ease;
        }
        .auth-links a:hover {
          color: #0056b3;
        }
      `}</style>
    </div>
  );
}
