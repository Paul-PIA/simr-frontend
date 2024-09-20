import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { apiClient } from '../services/api';

export default function ContractHomePage() {

  const[first,setFirst]=useState(true);
  const [contracts, setContracts] = useState([]);

  const fetchContracts=async ()=>{
    const token=localStorage.getItem('access');
    const decoded=jwtDecode(token);
    const id=decoded.user_id;
    const org=await apiClient({
      method:'GET',
      path:`user/${id}/`,
      data:{}
    }).org;
    const con=await apiClient({
      method:'GET',
      path:`contract/?org_icontains=${org}`
    });
    setContracts(con);
  };

  if (first){
    fetchContracts();
    setFirst(false)
  }

  const handleNewContract = () => {
    window.location='./NewContract'
  };

    // Fonction pour rediriger vers la page du contrat
    const handleContractClick = (contractId) => {
     window.location=`/contract?id=${contractId}`; // Navigation vers la page du contrat
    };
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>Page d'accueil</h1>
  
        <button style={styles.button} onClick={handleNewContract}>
          Créer un nouveau contrat
        </button>
  
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
                    <td
                      style={{ ...styles.td, cursor: 'pointer', color: 'blue' }}
                      onClick={() => handleContractClick(contract.id)}
                    >
                      {contract.name}
                    </td>
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