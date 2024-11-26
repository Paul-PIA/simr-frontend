import React,{useEffect, useState} from "react";
import Layout from "../components/Layout";
import { apiRefresh } from "../services/api";


export default function Home() {
  const [connecte,setConnecte]=useState(false);
  async function test() {
  await apiRefresh(()=>setConnecte(true)) }
  useEffect(() => {
      test(); 
  }, []);
  if (connecte){
  return <Layout />;
}
else {
  return <p>Chargement...</p>
}}
