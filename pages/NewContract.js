import React, {useState,useEffect } from "react";
import HomePageButton from "../components/HomePageButton";
import { jwtDecode } from "jwt-decode";
import { apiClient } from "../services/api";


export default function NewContract(){
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            const response = await apiClient({
              method: 'POST',
              path: 'token/refresh/',
              data: { refresh: localStorage.getItem('refresh') },
            });
            localStorage.setItem('access', response.access);
          } catch (error) {
            window.location = './auth';
          }
          const token=localStorage.getItem('access');
          const decoded=jwtDecode(token);
          const id=decoded.user_id ;
        const user=await apiClient({
            method:'GET',
            path:`user/${id}/`
        });
        console.log(user);
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
        window.location='./'
    }
    return (
        <div>
          <HomePageButton/>
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