import React, { useState } from "react";
import { apiClientNotoken,apiClientGetoken,apiClient } from "../services/api";
import { getToken, setToken } from "../services/jwt";

export default function Login() {
  return (
    <div>
      <div className="auth-form">
        <h2>Login</h2>
        <form 
  name="login" 
  onSubmit={async (e) => {
    e.preventDefault();
    await apiClientNotoken({
      method: 'POST',
      path: 'auth/login/',
      data: {
        username: document.forms.login.username.value,
        password: document.forms.login.password.value
      }
    });
    await apiClientGetoken({
      method: 'POST',
      path: 'token/',
      data: {
        username: document.forms.login.username.value,
        password: document.forms.login.password.value
      }
    });
    // await apiClient({
    //   method:'GET',
    //   path:'adam'
    // })
    window.location='..'
  }}
>
          <label>
            Username&nbsp;
            <input type="text" name="username" />
          </label>
          <label>
            Password&nbsp;&nbsp;
            <input type="password" name="password" />
          </label>
          <button type="submit">Login</button>
        </form>

        {/* <div className="auth-links">
          <a href="/forgot-password" className="forgot-password">
            Forgot Password?
          </a>
          <a href="/register" className="toggle-auth">
            Not have account?
          </a>
        </div> */}
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
