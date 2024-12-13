import React from "react";
import { apiClientNotoken,apiClientGetoken } from "../services/api";

export default function Register() {
  return (
    <div>
      <div className="auth-form">
        <h2>Créer un compte</h2>
        <form 
  name="register" 
  onSubmit={async (e) => {
    try{
    e.preventDefault();
    await apiClientNotoken({
      method: 'POST',
      path: 'auth/registration/',
      data: {
        username: document.forms.register.username.value,
        email:document.forms.register.email.value,
        password1: document.forms.register.password1.value,
        password2: document.forms.register.password2.value
      }
    });
    alert('E-mail de confirmation envoyé');
    await apiClientGetoken({
      data: {
        username: document.forms.login.username.value,
        password: document.forms.login.password.value
      }
    });
    location=location
  }catch(error){
    alert(error.request.responseText)
    console.log(error)
  }}}>
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
              type="email"
              name="email"
              placeholder="Email"
              required
            />
          </label>
          <label>
            <input
              type="password"
              name="password1"
              placeholder="Password"
              required
            />
          </label>
          <label>
            <input
              type="password"
              name="password2"
              placeholder="Repeat password"
              required
            />
          </label>
          <button type="submit">Enregistrer</button>
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
