// Cette page sert pour un utilisateur qui s'est déjà enregistré sur le site: ici, il remplit ses informations personnelles

import React, { useState } from "react";
import { apiClient } from "../services/api";
import {jwtDecode} from 'jwt-decode';
export default function inscription() {
  return (
    <div>
      <div className="inscription-form">
        <h2>Please fill in the necessary information</h2>
        <form 
  name="inscription" 
  onSubmit={async (e) => {
    e.preventDefault();
    const token=localStorage.getItem('access');
    const decoded=jwtDecode(token);
    const id=decoded.user_id;
    await apiClient({
      method: 'PATCH',
      path: `user/${id}`,
      data: {
        tel:document.forms.inscription.tel.value,
        first_name:document.forms.inscription.first.value,
        last_name:document.forms.inscription.last.value,
        city:document.forms.inscription.city.value
      }
    });
    window.location='../'
  }}
>
          <label>
            First name&nbsp;&nbsp;
            <input type="text" 
            name="first" 
            required/>
          </label>
          <label>
            Last name&nbsp;&nbsp;
            <input type="text" 
            name="last" 
            required/>
          </label>
          <label>
            Phone number&nbsp;&nbsp;
            <input type="tel" 
            name="tel" 
            required/>
          </label>
          <label>
            City&nbsp;&nbsp;
            <input type="text" 
            name="city" 
            required/>
          </label>
          <button type="submit">Save</button>
        </form>

      </div>
      <style jsx="true">{`
        .inscription-form {
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
        .inscription-form input {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        .inscription-form button {
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
        .inscription-form button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}
