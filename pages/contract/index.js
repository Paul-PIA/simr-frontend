import React, { useEffect, useState } from 'react';
import { apiClient, apiRefresh } from '../../services/api';
import HomePageButton from '../../components/HomePageButton';
import _Sider from "../../components/Sidebar";
import { Layout } from 'antd';

export default function Contract() {  // Récupérer l'ID du contrat depuis l'URL
  const [contract, setContract] = useState(null); //Dictionnaire représentant le contract. Voir "API documentation" pour les clés.
  const [org_names,setOrg_names]=useState([]); //Noms des organisations faisant partie du contract
  const [exercises, setExercises] = useState([]); //Liste des exercices du contract
  const [orgPrincipale,setOrgPrincipale]=useState(-1); //Indice de l'organisation principale du contract

  const {Content}=Layout;
  const fetchContract = async () => {
    await apiRefresh();
    try{
      const queryParams = new URLSearchParams(window.location.search);
      const id = queryParams.get('id');
      const response = await apiClient({
        method: 'GET',
        path: `contract/${id}/`,
      });
      setContract(response);
       const l=await Promise.all(
        response.org.map(async (orga) => {
          const Orgesponse=await apiClient({
            method: 'GET',
            path: `organization/${orga}/`
          });
          return Orgesponse.name
        }));
          setOrg_names(l);
      const indicePrincipale=response.org.findIndex(async (org_id)=>{
        const right=await apiClient({
          method:'GET',
          path:`orgconright/?org=${org_id}&con=${id}`
        });
        return right[0].is_principal
      });
      setOrgPrincipale(indicePrincipale)

        const l_ex=await apiClient({
            method:'GET',
            path:`exercise/?con=${id}`
        } );
        setExercises(l_ex);
            // Mettre à jour le contrat avec les données récupérées
    } catch (error) {
      console.error('Failed to fetch contract:', error);
    }
  };
useEffect(()=>{fetchContract()},[]);

  if (!contract) {
    return <div>Chargement...</div>;
  }
  return (<div> <HomePageButton />
  <Layout style={{ minHeight: "100vh", margin: 0, padding: 0 }}>
    <_Sider fix={{positiob:"absolute"}}/>
    <Content>
    <div style={styles.container}>
      <title>{contract.name}</title>
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
              <li key={index} style={styles.listItem}>{orgName} {orgPrincipale==index && "(Organisation principale)"}</li>
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
            <td> 
            <a href={`/exercise?id=${exercise.id}`} style={{ ...styles.td, cursor: 'pointer', color: 'blue' }}>
            {exercise.name} </a> </td>
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

      {/* Button to create a new exercise */}
      <a href={`/contract/new_ex?con_id=${new URLSearchParams(window.location.search).get('id')}`}>
      <button style={styles.button}>
        Créer un nouvel exercice
      </button> </a>
    </div></Content></Layout></div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
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
  td:{textDecoration:null}
};