'use client'

import React, { useState } from 'react';
import { apiClient } from '../../services/api';


export default function Contract() {  // Récupérer l'ID du contrat depuis l'URL
  const [contract, setContract] = useState(null);
  const [first,setFirst]=useState(true);
  const [org_names,setOrg_names]=useState([]);
  const [exercises, setExercises] = useState([]);
  const fetchContract = async () => {
    try {
      const tok=await apiClient({
        method:'POST',
        path:'token/refresh/',
        data:{refresh:localStorage.getItem('refresh')}
      });
      localStorage.setItem('access',tok.access)
      const ind=window.location.href.indexOf('contract?id') //Position de la lettre c
      const id = window.location.href.substring(ind+12) //12= taille de 'contract?id=
      const response = await apiClient({
        method: 'GET',
        path: `contract/${id}/`,
      });
      setContract(response);
      console.log(response);
       const l=await Promise.all(
        response.org.map(async (orga) => {
          const Orgesponse=await apiClient({
            method: 'GET',
            path: `organization/${orga}/`,
            data:{}
          });
          return Orgesponse.name
        }));
          console.log(l);
          setOrg_names(l);

        const l_ex=await apiClient({
            method:'GET',
            path:`exercise/?con_exact=${id}`,
            data: {}
        } );
        setExercises(l_ex);
            // Mettre à jour le contrat avec les données récupérées
    } catch (error) {
      console.error('Failed to fetch contract:', error);
    }
  };
  if (first){
    if (typeof window !=='undefined'){
    fetchContract();
}
setFirst(false)
}
  if (!contract) {
    return <div>Chargement...</div>;
  }
  return (
    <div style={styles.container}>
      {/* Contrat Details Section */}
      <div style={styles.contractDetailsBanner}>
        <h1 style={styles.header}>Détails du contrat : {contract.name}</h1>
        <p>Nombre d'organisations: {contract.nb_org}</p>
      </div>

      {/* Display organization names */}
      <div style={styles.section}>
        <h2 style={styles.subHeader}>Organisations associées :</h2>
        <ul>
          {org_names.length > 0 ? (
            org_names.map((orgName, index) => (
              <li key={index} style={styles.listItem}>{orgName}</li>
            ))
          ) : (
            <p>Aucune organisation trouvée.</p>
          )}
        </ul>
      </div>

      {/* Display past exercises */}
      <h2 style={styles.subHeader}>Exercices passés :</h2>
      <ul>
        {exercises.length > 0 ? (
          exercises.map((exercise, index) => (
            <li key={index} style={styles.listItem}>
              Exercice {exercise.id} : {exercise.name}
            </li>
          ))
        ) : (
          <p>Aucun exercice passé trouvé.</p>
        )}
      </ul>

      {/* Button to create a new exercise */}
      <button style={styles.button} onClick={(e)=>{
              const ind=window.location.href.indexOf('contract?id'); //Position de la lettre c
              const id = window.location.href.substring(ind+12); //12= taille de 'contract?id=
              window.location=`./contract/new_ex?con_id=${id}`}}>
        Créer un nouvel exercice
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  contractDetailsBanner: {
    backgroundColor: '#f0f0f0',
    width: '100%',
    padding: '20px',
    marginBottom: '20px',
    textAlign: 'center',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '32px',
    marginBottom: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '30px',
    backgroundColor: '#0056b3',
    color: 'white',
    border: 'none',
  },
  subHeader: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  listItem: {
    fontSize: '18px',
    padding: '5px 0',
  },
  section: {
    width: '100%',
    maxWidth: '600px',
    padding: '20px',
    marginBottom: '20px',
    textAlign: 'left',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};