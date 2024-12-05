import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { apiClient } from '../services/api';
import ExercisePage from './filePage';

export default function ContractHomePage() {

  const [contracts, setContracts] = useState([]);
  const [space,setSpace]=useState("");
  const [exercises,setExercise]=useState([])

  const fetchContracts=async ()=>{
    const response=await apiClient({
      method:'GET',
      path:'homedata/'
    });
    setSpace(response.space);
    setContracts(response.contracts);
    setExercise(response.exercises)
};

useEffect(()=>{fetchContracts()},[]);

     const styles = {
      container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      },
      header: {
        fontSize: '32px',
        marginBottom: '20px',
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
      contractsContainer: {
        width: '100%',
        maxWidth: '600px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
      },
      subHeader: {
        fontSize: '24px',
        marginBottom: '10px',
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        border: '1px solid #ccc',
      },
      th: {
        borderBottom: '2px solid #ccc',
        padding: '12px 8px',
        textAlign: 'left',
      },
      td: {
        padding: '12px 8px',
        borderBottom: '1px solid #eee',
      },
      row: {
        cursor: 'pointer',
      },
    };
    if (space=="General"){
    return (
      <div style={styles.container}>
        <title>Page d'accueil simR</title>
        <h1 style={styles.header}>Page d'accueil</h1>
  
  
        <div style={styles.contractsContainer}>
          <h2 style={styles.subHeader}>Contrats actuels</h2>
  
          {/* Affichage des contrats */}
          {contracts.length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Nom</th>
                  <th style={styles.th}>Nombre d'organisations</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr key={contract.id} style={styles.row}>
                    <td style={styles.td}>{contract.id}</td>
                    <a href={`/contract?id=${contract.id}`}>
                    <td style={{ ...styles.td, cursor: 'pointer', color: 'blue' }} >
                      {contract.name}
                    </td> </a>
                    <td style={styles.td}>{contract.nb_org}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Aucun contrat actuellement disponible.</p>
          )}
        </div>
      </div>
    )};
    if (space=="Contract"){
      return (
        <div style={styles.container}>
          <h1 style={styles.header}>Page d'accueil</h1>
    
    
          <div style={styles.contractsContainer}>
            <h2 style={styles.subHeader}>Contract: {contracts[0].name}</h2>
            <h2 style={styles.subHeader}>Exercices passés :</h2>
      <ul>
        {exercises.length > 0 ? (
                      <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>ID</th>
                          <th style={styles.th}>Nom</th>
                          <th style={styles.th}>Date de début</th>
                          <th style={styles.th}>Date de fin</th>
                        </tr>
                      </thead>
                      <tbody>
          {exercises.map((exercise) => (
            <tr key={exercise.id} style={styles.row}>
            <td style={styles.td}>{exercise.id}</td>
            <a href={`/exercise?id=${exercise.id}`}>
            <td
              style={{ ...styles.td, cursor: 'pointer', color: 'blue' }}
            >
              {exercise.name}
            </td> </a>
            <td style={styles.td}>{exercise.date_i}</td>
            <td style={styles.td}>{exercise.date_f}</td>
          </tr>
          ))}
          </tbody>
          </table>
        ) : (
          <p>Aucun exercice passé trouvé.</p>
        )}
      </ul>
        </div>
        <button style={styles.button} onClick={(e)=>{
              window.location=`./contract/new_ex?con_id=${contracts[0].id}`}}>
        Créer un nouvel exercice
      </button>
        </div>)}

  if (space=="Exercise"){
    return (
      <div styles={styles.container}>
        <ExercisePage id={exercises[0].id}/>
      </div>
    )
  }
}