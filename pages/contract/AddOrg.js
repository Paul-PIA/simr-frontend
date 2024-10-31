import React, { useState, useEffect } from "react";
import { apiClient } from "../../services/api";
import HomePageButton from "../../components/HomePageButton";
import { Layout } from "antd";
import Sider_ from "../../components/Sidebar";

export default function EditContract() {
  const [contractName, setContractName] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [newOrganizations, setNewOrganizations] = useState([{ name: "", leader: "" }]);

  const {Content}=Layout;

  const fetchContract = async () => {
    try{
      const response=await apiClient({
        method:'POST',
        path:'token/refresh/',
        data:{refresh:localStorage.getItem('refresh')}
      });
      localStorage.setItem('access',response.access);
    }
    catch (error){
      window.location='./auth';
    }
    const queryParams = new URLSearchParams(window.location.search);
    const contractId = queryParams.get("id");
    const response = await apiClient({
      method: "GET",
      path: `contract/${contractId}/`,
    });
    setContractName(response.name);

    const list_org = await Promise.all(
      response.org.map(async (value) => {
        const orga = await apiClient({
          method: "GET",
          path: `organization/${value}/`,
        });
        return orga.name;
      })
    );
    setOrganizations(list_org);
  };

  useEffect(() => {
    fetchContract();
  }, []);

  const handleNewOrganizationChange = (index, event) => {
    const { name, value } = event.target;
    const updatedNewOrganizations = [...newOrganizations];
    updatedNewOrganizations[index] = {
      ...updatedNewOrganizations[index],
      [name]: value,
    };
    setNewOrganizations(updatedNewOrganizations);
  };

  const addNewOrganizationField = () => {
    setNewOrganizations([...newOrganizations, { name: "", leader: "" }]);
  };

  const removeNewOrganizationField = (index) => {
    const updatedNewOrganizations = newOrganizations.filter((_, i) => i !== index);
    setNewOrganizations(updatedNewOrganizations);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const IdOrga= await Promise.all(
      newOrganizations.map(async (value)=>{
        const response=await apiClient({
          method:'GET',
          path:`organization/?name=${value.name}`
        });
        return response.id
      })
    );
    const data={};
    IdOrga.forEach((value,index)=>{
      data[String(value)]=newOrganizations[index].leader
    });
    const queryParams = new URLSearchParams(window.location.search);
    const contractId = queryParams.get("id");
    await apiClient({
      method:'POST',
      path:`invitechief/${contractId}/`,
      data:data
    })  
    
  };

  return (
    <div>
      <HomePageButton/>
      <Layout><Sider_/><Content>
      <div className="contract-form">
        <h2>Modifier le Contrat</h2>
        <form name="contract" onSubmit={handleSubmit}>
          <label>
            Nom du contrat&nbsp;
            <input type="text" value={contractName} disabled />
          </label>

          <h3>Organisations existantes</h3>
          {organizations.map((organization, index) => (
            <div key={index} className="organization-field">
              <label>
                Organisation {index + 1}:&nbsp;
                <input type="text" value={organization} disabled />
              </label>
            </div>
          ))}

          <h3>Ajouter de nouvelles organisations</h3>
          {newOrganizations.map((organization, index) => (
            <div key={index} className="new-organization-field">
              <label>
                Nom de l'organisation {index + 1 +organizations.length}&nbsp;
                <input
                  type="text"
                  name="name"
                  value={organization.name}
                  onChange={(event) => handleNewOrganizationChange(index, event)}
                  required
                />
              </label>
              <label>
                Email du chef&nbsp;
                <input
                  type="email"
                  name="leader"
                  value={organization.leader}
                  onChange={(event) => handleNewOrganizationChange(index, event)}
                  required
                />
              </label>
              {newOrganizations.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeNewOrganizationField(index)}
                >
                  Supprimer
                </button>
              )}
            </div>
          ))}

          <button type="button" className="add-btn" onClick={addNewOrganizationField}>
            Ajouter une organisation
          </button>

          <button type="submit" className="submit-btn">
            Envoyer des invitations
          </button>
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
        .organization-field, .new-organization-field {
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
      </Content></Layout>
    </div>
  );
}
