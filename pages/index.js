import React,{useEffect, useState} from "react";
import Layout from "../components/Layout";
import { apiClient } from "../services/api";


export default function Home() {
  const [connecte,setConnecte]=useState(false);
  async function test() {
    
  
  try{ //On vérifie que l'utilisateur est connecté. Si ce n'est pas le cas (ou que la connection a expiré), on le redirige vers la page d'authentification
    const response=await apiClient({
      method:'POST',
      path:'token/refresh/',
      data:{refresh:localStorage.getItem('refresh')}
    });
    localStorage.setItem('access',response.access);
    setConnecte(true)
  }
  catch (error){
    window.location='./auth';
  }}
  useEffect(() => {
    if (typeof window !== 'undefined') {
      test(); 
    }
  }, []);
  if (connecte){
  return <Layout />;
}
else {
  return <p>Chargement...</p>
}}
