import React, {useState,useEffect } from "react";
import HomePageButton from "../components/HomePageButton";
import { jwtDecode } from "jwt-decode";
import { apiClient, apiRefresh } from "../services/api";
import _Sider from "../components/Sidebar";

//Actuellement, l'organisation de l'utilisateur qui crée le contract est supposé être l'organisation principale du contract
//A long terme, cela devrait amener à être modifié en rajoutant un champ "organisation principale" (voir dans InformationForm.js  comment faire)
export default function NewContract(){
    const handleSubmit=async(e)=>{
        e.preventDefault();
        await apiRefresh();
        const token=localStorage.getItem('access');
        const decoded=jwtDecode(token);
        const id=decoded.user_id ;
        const user=await apiClient({
            method:'GET',
            path:`user/${id}/`
        });
        await apiClient({
            method:'POST',
            path:'contract/',
            data:{
                name:document.forms.contract.conName.value,
                nb_org:1024,
                nb_access:1024,
                org:user.org
            }
        });
        location='./'
    }
    return (
        <div>
          <HomePageButton/>
          <_Sider/>
          <div className="contract-form">
            <h2>Créer un contract</h2>
            <form name="contract" onSubmit={handleSubmit}>
              <label>
                Nom du contrat&nbsp;
                <input type="text" name="conName" required/>
              </label>
    
              <button type="submit" className="submit-btn">
                Créer
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
            .submit-btn {
              margin-top: 20px;
            }
          `}</style>
        </div>
      );
}