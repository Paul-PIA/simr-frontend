import React from "react";
import Layout from "../components/Layout";

export default function Home() {
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('refresh')==null){
      window.location='./auth'
    }
  }
  return <Layout />;
}
