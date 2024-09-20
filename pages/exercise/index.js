import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import { jwtDecode } from 'jwt-decode';

export default function ExercisePage() {
    const [user,setUser]=useState({});
  const [exercise, setExercise] = useState({});
  const [selectedSpace, setSelectedSpace] = useState('Mon espace');
  const[allFiles,setallFiles]=useState([]);
  const [rights,setRights]=useState([]);
  const [files, setFiles] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  // Fonction pour récupérer les informations de l'exercice
  const fetchEx = async () => {
    try{
        const response=await apiClient({
          method:'POST',
          path:'token/refresh/',
          data:{refresh:localStorage.getItem('refresh')}
        });
        localStorage.setItem('access',response.access);
      }
      catch (error){
        window.location='./auth';
      }
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    // Remplacer par la requête réelle pour obtenir les données de l'exercice
    const response = await apiClient({
        method:'GET',
        path:`exercise/${id}/`
    });
    setExercise(response);
    const response_files=await apiClient({
        method:'GET',
        path:`file/?exer_exact=${exercise.id}`
    });
    setallFiles(response_files);
    const response_rights=await Promise.all(
        allFiles.map(async(fil)=>{await apiClient({
        method:'GET',
        path:`access/${fil.id}`
    })}));
    setRights(response_rights);
    const token=localStorage.getItem('access');
    const decoded=jwtDecode(token);
    const user_id=decoded.user_id;
    const User=apiClient({
        method:'GET',
        path:`user/${user_id}/`
    });
    setUser(User);

  };

  // Récupérer l'ID de la requête URL
  useEffect(() => {
    fetchEx();
  }, []);

  const fetchFiles= ()=>{
    if (selectedSpace=='Public'){
        setFiles(allFiles.filter((file)=>file.is_public))
    }
    if (selectedSpace=='Mon espace'){
        setFiles(allFiles.filter((file,index)=>{
            (rights[index].user.includes(user.id))
        }))
    }
    if (selectedSpace=='Mon organisation'){
        setFiles(allFiles.filter((file,index)=>{
            (rights[index].org.includes(user.org)) 
    }))

    }
  }

  // Charger des fichiers en fonction de l'espace sélectionné
  useEffect(() => {
    fetchFiles()
  }, [selectedSpace]);

  // Fonction pour ouvrir un fichier
  const handleOpen = (fileId) => {
    alert(`Ouverture du fichier ${fileId}`);
  };

  // Ouvrir la fenêtre de confirmation de suppression
  const handleDelete = (file) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  // Confirmer la suppression du fichier
  const confirmDelete = () => {
    alert(`Fichier ${fileToDelete.name} supprimé`);
    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  // Annuler la suppression
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  const handleNewFile = () => {
    history.push(`/exercise/newfile?exer_id=${exercise.id}`);
  };

  if (!exercise.name) {
    return <div>Chargement...</div>;
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        {exercise.name || 'Exercice sans titre'}
        <button style={styles.newFileButton} onClick={handleNewFile}>
          New file
        </button>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.sidebar}>
          <button
            style={selectedSpace === 'Mon espace' ? styles.selectedButton : styles.button}
            onClick={() => setSelectedSpace('Mon espace')}
          >
            Mon espace
          </button>
          <button
            style={selectedSpace === 'Mon organisation' ? styles.selectedButton : styles.button}
            onClick={() => setSelectedSpace('Mon organisation')}
          >
            Mon organisation
          </button>
          <button
            style={selectedSpace === 'Public' ? styles.selectedButton : styles.button}
            onClick={() => setSelectedSpace('Public')}
          >
            Public
          </button>
        </div>

        <div style={styles.verticalLine}></div>

        <div style={styles.fileList}>
          {files.length > 0 ? (
            files.map((file) => (
              <div key={file.id} style={styles.fileRow}>
                <span>{file.name}</span>
                <button style={styles.blueButton} onClick={() => handleOpen(file.id)}>
                  Open
                </button>
                <button style={styles.redButton} onClick={() => handleDelete(file)}>
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>Aucun fichier disponible</p>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <p>Are you sure you want to delete {fileToDelete.name}?</p>
            <div>
              <button style={styles.whiteButton} onClick={cancelDelete}>
                Cancel
              </button>
              <button style={styles.redButton} onClick={confirmDelete}>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  pageContainer: {
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    backgroundColor: '#0056b3',
    color: 'white',
    padding: '20px',
    fontSize: '24px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  newFileButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  mainContent: {
    display: 'flex',
    marginTop: '20px',
  },
  sidebar: {
    width: '200px',
    display: 'flex',
    flexDirection: 'column',
    paddingRight: '20px',
  },
  button: {
    padding: '10px',
    margin: '5px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    cursor: 'pointer',
  },
  selectedButton: {
    padding: '10px',
    margin: '5px',
    backgroundColor: '#0056b3',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  verticalLine: {
    borderLeft: '2px solid #ccc',
    height: '100%',
    marginLeft: '20px',
    marginRight: '20px',
  },
  fileList: {
    flex: 1,
    padding: '20px',
  },
  fileRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  blueButton: {
    backgroundColor: '#0056b3',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  redButton: {
    backgroundColor: '#d9534f',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  modal: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    textAlign: 'center',
  },
  whiteButton: {
    backgroundColor: 'white',
    color: '#000',
    border: '1px solid #ccc',
    padding: '5px 10px',
    cursor: 'pointer',
    marginRight: '10px',
  },
};