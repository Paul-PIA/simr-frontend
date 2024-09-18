import React,{useEffect} from "react";
import Layout from "../components/Layout";
import { apiClient } from "../services/api";


export default function Home() {
  async function test() {
    
  
  try{
    const response=await apiClient({
      method:'POST',
      path:'token/refresh',
      data:{refresh:localStorage.getItem('refresh')}
    });
    localStorage.setItem('access',response.access)
  }
  catch (error){
    window.location='./auth';
  }}
  useEffect(() => {
    if (typeof window !== 'undefined') {
      test(); 
    }
  }, []);
  
  return <Layout />;
}
