// Cette page sert pour un utilisateur qui s'est déjà enregistré sur le site: ici, il remplit ses informations personnelles

import React, { useEffect, useState } from "react";
import { apiClient } from "../services/api";
import {jwtDecode} from 'jwt-decode';
export default function Inscription() {
  const [org,setOrg]=useState([]);
  const [selectedOrg, setSelectedOrg] = useState("");
  const fetchOrgs=async()=>{
    const response=await apiClient({
      method:'GET',
      path:'organization/?ordering=name'
    });
    setOrg(response)
  }
  useEffect(()=>{fetchOrgs()},[]);
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
      path: `user/${id}/`,
      data: {
        tel:document.forms.inscription.tel.value,
        first_name:document.forms.inscription.first.value,
        last_name:document.forms.inscription.last.value,
        city:document.forms.inscription.city.value,
        org: selectedOrg // Envoi de l'organisation sélectionnée
      }
    });
    window.location='../'
  }}
>
          <label>
            Prénom&nbsp;&nbsp;
            <input type="text" 
            name="first" 
            required/>
          </label>
          <label>
            Nom&nbsp;&nbsp;
            <input type="text" 
            name="last" 
            required/>
          </label>
          <label>
            Téléphone&nbsp;&nbsp;
            <input type="tel" 
            name="tel" 
            required/>
          </label>
          <label>
            Ville&nbsp;&nbsp;
            <input type="text" 
            name="city" 
            required/>
          </label>
          <select
        name="organization"
        value={selectedOrg}
        onChange={(e) => setSelectedOrg(e.target.value)} // Mise à jour de l'organisation sélectionnée
        required
      >
        <option value="" disabled>Sélectionnez votre organisation</option>
        {org.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>

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
        .inscription-form input,
        .inscription-form select {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        .inscription-form select {
          background-color: #f9f9f9;
          cursor: pointer;
        }
        .inscription-form select:focus {
          border-color: #007bff;
          outline: none;
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
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
        .inscription-form label {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 5px;
          display: block;
          color: #333;
        }
      `}</style>
    </div>
  );
}