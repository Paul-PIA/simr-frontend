import React from "react";
import { apiClient, apiRefresh } from "../services/api";

export default function ChangePassword() {
  return (
    <div>
      <div className="change-form">
        <h2>Modifier votre mot de passe</h2>
        <form 
  name="change" 
  onSubmit={async (e) => {
    e.preventDefault();
    await apiRefresh();
    await apiClient({
      method: 'POST',
      path: 'auth/password/change/',
      data: {
        new_password1: document.forms.change.new_password1.value,
        new_password2: document.forms.change.new_password2.value
      }
    });
    location='/auth'
  }}
>
          <label>
            Nouveau mot de passe&nbsp;
            <input type="password" name="new_password1" />
          </label>
          <label>
            Répéter le nouveau mot de passe&nbsp;&nbsp;
            <input type="password" name="new_password2" />
          </label>
          <button type="submit">Envoyer</button>
        </form>

      </div>
      <style jsx="true">{`
        .change-form {
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
        .change-form input {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        .change-form button {
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
        .change-form button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}
