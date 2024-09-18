import React, { useState } from "react";
import { apiClient } from "../services/api";

export default function NewContract() {
  const [contractName, setContractName] = useState("");
  const [organizations, setOrganizations] = useState([""]);

  const handleContractNameChange = (event) => {
    setContractName(event.target.value);
  };

  const handleOrganizationChange = (index, event) => {
    const newOrganizations = [...organizations];
    newOrganizations[index] = event.target.value;
    setOrganizations(newOrganizations);
  };

  const addOrganizationField = () => {
    setOrganizations([...organizations, ""]);
  };

  const removeOrganizationField = (index) => {
    const newOrganizations = organizations.filter((_, i) => i !== index);
    setOrganizations(newOrganizations);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Utiliser Promise.all pour effectuer les requêtes en parallèle
    const IdOrganizations = await Promise.all(
      organizations.map(async (org) => {
        const response = await apiClient({
          method: 'GET',
          path: `organization/?name_exact=${org}`,
        });
        console.log(response);
        return response[0].id; // Retourne l'ID de l'organisation
      })
    );
  
    console.log(IdOrganizations);
  
    // Faire la requête POST après avoir récupéré tous les IDs d'organisations
    await apiClient({
      method: 'POST', // correction d'une typo "meyhod" => "method"
      path: 'contract',
      data: { org: IdOrganizations, name: contractName, nb_org: IdOrganizations.length, nb_access:1024 },
    });
  };
  

  return (
    <div>
      <div className="contract-form">
        <h2>New Contract</h2>
        <form name="contract" onSubmit={handleSubmit}>
          <label>
            Contract Name&nbsp;
            <input
              type="text"
              name="contractName"
              value={contractName}
              onChange={handleContractNameChange}
              required
            />
          </label>

          <h3>Organizations</h3>
          {organizations.map((organization, index) => (
            <div key={index} className="organization-field">
              <label>
                Organization {index + 1}&nbsp;
                <input
                  type="text"
                  value={organization}
                  onChange={(event) => handleOrganizationChange(index, event)}
                  required
                />
              </label>
              {organizations.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeOrganizationField(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button type="button" className="add-btn" onClick={addOrganizationField}>
            Add Organization
          </button>

          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
      <style jsx="true">{`
        .contract-form {
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
        .contract-form input {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        .contract-form button {
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
        .contract-form button:hover {
          background-color: #0056b3;
        }
        .organization-field {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .remove-btn {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 5px 10px;
          cursor: pointer;
          border-radius: 4px;
          margin-left: 10px;
          font-size: 12px;
        }
        .remove-btn:hover {
          background-color: #c82333;
        }
        .add-btn {
          margin-top: 10px;
          background-color: #28a745;
        }
        .add-btn:hover {
          background-color: #218838;
        }
        .submit-btn {
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}
