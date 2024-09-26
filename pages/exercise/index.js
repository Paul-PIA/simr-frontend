import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import { jwtDecode } from 'jwt-decode';

export default function ExercisePage() {
    const [user,setUser]=useState({});
  const [exercise, setExercise] = useState({});
  const [selectedSpace, setSelectedSpace] = useState('Mon espace');
  const [allFiles,setallFiles]=useState([]);
  const [rights,setRights]=useState([]);
  const [files, setFiles] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPublicModal,setShowPublicModal]=useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [fileToShare,setFileToSharePublic]=useState(null);

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
    console.log(id);
    const response = await apiClient({
        method:'GET',
        path:`exercise/${id}/`
    });
    setExercise(response);
    const response_files=await apiClient({
        method:'GET',
        path:`file/?exer=${id}`
    });
    setallFiles(response_files);
    const response_rights=await Promise.all(
        response_files.map(async (fil)=>{const rep=await apiClient({
        method:'GET',
        path:`access/${fil.id}/`
    });
  return rep}));
    setRights(response_rights);
    const token=localStorage.getItem('access');
    const decoded=jwtDecode(token);
    const user_id=decoded.user_id;
    const User=await apiClient({
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
            return (rights[index].user.includes(user.id))
        }))
    }
    if (selectedSpace=='Mon organisation'){
        setFiles(allFiles.filter((file,index)=>{
           return (rights[index].org.includes(user.org)) 
    }))

    }
  }

  useEffect(() => {
    fetchFiles()
  }, [selectedSpace,user]); //S'active en changeant d'espace ou à la fin de l'exécution de fetchEx

  // Fonction pour ouvrir un fichier
  const handleOpen = (fileId) => {
    window.location=`./file?id=${fileId}`;
  };

  // Ouvrir la fenêtre de confirmation de suppression
  const handleDelete = (file) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  const handlePublic = (file) => {
    setFileToSharePublic(file);
    setShowPublicModal(true);
  };
  // Confirmer la suppression du fichier
  const confirmDelete = () => {
    alert(`Fichier ${fileToDelete.name} supprimé`);
    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  const confirmPublic = () => {
    alert(`Fichier ${fileToShare.name} partagé`);
    setShowPublicModal(false);
    setFileToSharePublic(null);
  };

  // Annuler la suppression
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  const cancelPublic = () => {
    setShowPublicModal(false);
    setFileToSharePublic(null);
  };

  const handleNewFile = () => {
    window.location=`/exercise/newfile?exer_id=${exercise.id}`;
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
                  Ouvrir
                </button>
                { selectedSpace=="Mon organisation" ?(
                    <button style={styles.blueButton} onClick={() => handlePublic(file)}>
                     Rendre public
                  </button>
                ):(null)}
                <button style={styles.redButton} onClick={() => handleDelete(file)}>
                  Supprimer
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
            <p>Etes-vous sûr de vouloir supprimer {fileToDelete.name}?</p>
            <div>
              <button style={styles.whiteButton} onClick={cancelDelete}>
                Annuler
              </button>
              <button style={styles.redButton} onClick={confirmDelete}>
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
      {showPublicModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <p>Etes-vous sûr(e) de vouloir partager  {fileToShare.name}?</p>
            <div>
              <button style={styles.whiteButton} onClick={cancelPublic}>
                Annuler
              </button>
              <button style={styles.redButton} onClick={confirmPublic}>
                Confirmer
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