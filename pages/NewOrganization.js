import React, { useState } from "react";
import { apiClient } from "../services/api";
import HomePageButton from "../components/HomePageButton";

export default function CreateNewOrganization() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Soumission des données pour créer une nouvelle organisation
      await apiClient({
        method: "POST",
        path: "organization/",
        data: { name:name, email:email, tel:telephone, adrs:address, post:postcode },
      });
      // Affiche un message de succès ou redirige après soumission
      alert("Organization created successfully!");
      location='..'
    } catch (error) {
      console.error("Failed to create organization", error);
      // Gestion des erreurs (afficher un message à l'utilisateur)
      alert("Failed to create organization. Please try again.");
    }
  };

  return (
    <div>
      <HomePageButton/>
      <div className="organization-form">
        <h2>Créer une nouvelle organisation</h2>
        <form name="organization" onSubmit={handleSubmit}>
          <label>
            Nom de l'organisation&nbsp;
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Email&nbsp;
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Téléphone&nbsp;
            <input
              type="tel"
              name="telephone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
            />
          </label>
          <label>
            Addresse&nbsp;
            <input
              type="text"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>
          <label>
            Code postal&nbsp;
            <input
              type="text"
              name="postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="submit-btn">
            Créer l'organisation
          </button>
        </form>
      </div>

      <style jsx="true">{`
        .organization-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 30px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 400px;
          max-width: 90%;
          margin: 0 auto;
        }
        .organization-form input {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        .organization-form button {
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
        .organization-form button:hover {
          background-color: #0056b3;
        }
        .organization-form label {
          display: block;
          margin-bottom: 10px;
          font-weight: bold;
          width: 100%;
        }
        .submit-btn {
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}
