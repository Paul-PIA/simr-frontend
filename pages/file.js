import React, { useEffect, useState } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { apiClient, apiClientGetFile } from '../services/api';
import ExcelToAgGrid from '../contents/AffichageGrid';
import * as XLSX from 'xlsx';
import HomePageButton from '../components/HomePageButton';
import { jwtDecode } from 'jwt-decode';
import AffichageCommentaires from '../contents/AffichageCommentaires';
import {Layout} from 'antd';
import Sider_ from '../components/Sidebar';

const FilePage = () => {
const {Content,Header}=Layout;

  const [fileDetails, setfileDetails] = useState({});
  const [doc, setDoc] = useState(null);
  const [comments, setComments] = useState([]); // Pour stocker les commentaires
  const [showComments, setShowComments] = useState(false); // Pour afficher l'onglet des commentaires
  const [highlightedCell, setHighlightedCell] = useState(null); // Pour stocker la cellule surlignée
  const [columnDefs, setColumnDefs] = useState([]);
  const [commenting,setCommenting]=useState(false); 
  const [self,setSelf]=useState({});  //L'utilisateur
  const [orgConRights,setOrgConRights]=useState({});
  const [orgUsers,setOrgUsers]=useState([]);  //Tous les utilisateurs de mon organisation
  const [selectedDealer,setSelectedDealer]=useState({}) //Dictionnaire {commentaire:dealer}
  const [children,setChildren]=useState({});
  const [charts, setCharts] = useState([]);

  const conversionPourEnvoie=(doc)=>{
    const excelBuffer = XLSX.write(doc, { bookType: 'xlsx', type: 'array' });
    // 3. Créer un objet Blob à partir du fichier binaire
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    // 4. Créer un objet File en spécifiant le nom du fichier
    const file = new File([blob], 'modifications.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return file
  }
  useEffect(() => { //Importe depuis le backend toutes les données utiles
    const fetchFile = async () => {
      try {
        const response = await apiClient({
          method: 'POST',
          path: 'token/refresh/',
          data: { refresh: localStorage.getItem('refresh') },
        });
        localStorage.setItem('access', response.access);
      } catch (error) {
        window.location = './auth';
      }

      const queryParams = new URLSearchParams(window.location.search);
      const id = queryParams.get('id');
      const response = await apiClient({
        method: 'GET',
        path: `file/${id}/`,
      });
      setfileDetails(response);
      try {
        const fichier = await apiClientGetFile({
          method: 'GET',
          path: response.content
        });
        const workbook = XLSX.read(fichier, { type: 'array' });
        setDoc(workbook);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const columns = jsonData[0];
        setColumnDefs(columns);
      } catch (error) {
        console.error('Error fetching file:', error);
      }
        const token=localStorage.getItem('access');
        const decoded=jwtDecode(token);
        const user_id=decoded.user_id;
        const user=await apiClient({
          method:'GET',
          path:`user/${user_id}/`
        });
        setSelf(user);
        const monOrgContract=await apiClient({
          method:'GET',
          path:`orgconright/?org=${user.org}&con=${response.con}`
        });
        setOrgConRights(monOrgContract[0]);
        if (monOrgContract[0].chief===user.id){
          const mesCollègues=await apiClient({
            method:'GET',
            path:`user/?org=${user.org}`
          });
          setOrgUsers(mesCollègues);
        }
       

    };

    fetchFile();
  }, []);

  const handleSaveCopy = async () => {
    try {
      const file=conversionPourEnvoie(doc);
      await apiClient({
        method: 'POST',
        path: 'file/',
        data: { name: "copie de " + fileDetails.name,
           content: file, 
           exer:fileDetails.exer, con:fileDetails.con }
      });
      alert('Copie enregistrée avec succès.');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la copie:', error);
    }
  };

  const handleSaveChanges = async () => {
    const file=conversionPourEnvoie(doc);
    try {
      await apiClient({
        method: 'PATCH',
        path: `file/${fileDetails.id}/`,
        data: { content: file },
      });
      alert('Modifications enregistrées avec succès.');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des modifications:', error);
    }
  };

  const handleGridUpdate = (updatedData) => {
    setDoc(updatedData);
  };

  const handleDownloadCopy = () => {
    // Télécharger le fichier en .xlsx
    XLSX.writeFile(doc, `${fileDetails.name || 'tableau'}.xlsx`);
  };
  

  const getColumnIndex = (columnName) => {
    const columnIndex = columnDefs.indexOf(columnName);
    return columnIndex >= 0 ? columnIndex + 1 : null; // Retourner l'indice (en ajoutant 1 pour la logique de l'API)
  };

  // Fonction pour ajouter un commentaire
  const handleAddComment = async (line, column, text) => {
    try {
      const indice=getColumnIndex(column);
      await apiClient({
        method: 'POST',
        path: 'comment/',
        data: {
          file: fileDetails.id,
          line: line,
          colone: indice,
          text: text
        }
      });
      alert('Commentaire ajouté avec succès.');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
    }
    if (commenting){await fetchComments()}
  };

  const handleViewCell = (line, column) => {
    setHighlightedCell({ rowIndex: line, colId: column });
  };

  // Fonction pour récupérer les commentaires
  const fetchComments = async () => {
    try {
      const response = await apiClient({
        method: 'GET',
        path: `comment/?file=${fileDetails.id}`,
      });
      response.map((comment)=>{
        selectedDealer[comment.id]=comment.dealer
        if (comment.parent){
          try{
        children[comment.parent].push(comment)}
        catch(error){
          children[comment.parent]=[comment]
        } }
      });
      setComments(response);
      setShowComments(true);// Affiche l'onglet des commentaires
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
    }
  };

  

  const styles = {
    banner: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      backgroundColor: '#f0f0f0',
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      marginLeft: '100px',
    },
    commentContainer: {
      marginTop: '20px',
      maxHeight: '300px',
      marginLeft:'20px',
    },
    button: {
      padding: '10px',
      border: 'none',
      cursor: 'pointer',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '16px',
    }
  };

  return (
    <div>
      <title>{fileDetails.name}</title>
      <Layout style={{ minHeight: "100vh", margin: 0, padding: 0 }}>
        <Header style={{ padding:0, background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={styles.banner}>
      <HomePageButton />
        <div style={styles.buttonGroup}>
          <button onClick={handleSaveCopy} style={{ ...styles.button, backgroundColor: '#4CAF50' }}>Enregistrer une copie</button>
          {!fileDetails.is_final && !fileDetails.is_locked ?(
          <button onClick={handleSaveChanges} style={{ ...styles.button, backgroundColor: '#2196F3' }}>Sauvegarder les modifications</button>)
          :(<button style={{ ...styles.button, backgroundColor: '#2196F3' }}>Modifications impossibles</button>)
          }
          <button onClick={handleDownloadCopy} style={{ ...styles.button, backgroundColor: '#FF9800' }}>Télécharger sur mon ordinateur</button>
          {!showComments ? (<button onClick={fetchComments} style={{ ...styles.button, backgroundColor: '#FF5722' }}>Voir les commentaires</button>):null}
          <button onClick={() => setCommenting(!commenting)} style={{ ...styles.button, backgroundColor: commenting ? '#FF5722' : '#2196F3' }}>
            {commenting ? 'Terminer ajout de commentaire' : 'Rajouter un commentaire'}
          </button>
        </div>
      </div> </Header><Layout><Sider_/><Content>
      <div>{commenting? 'Appuyer sur la case à commenter':null}</div>
      
        <ExcelToAgGrid
          fileBuffer={doc}
          onGridUpdate={handleGridUpdate}
          onAddComment={handleAddComment}
          commenting={commenting} // Passer l'état de "commenting" à la grille
          highlightedCell={highlightedCell}  // Passer la cellule à surligner
          charts={charts}
          setCharts={setCharts}
        />
      

      {showComments && (   <div style={styles.commentContainer}> 
        <AffichageCommentaires 
        comments={comments}
        selectedDealer={selectedDealer}
        children={children}
        self={self}
        orgConRights={orgConRights}
        columnDefs={columnDefs}
        orgUsers={orgUsers}
        handleViewCell={handleViewCell}
        getComments={fetchComments}
        />
       </div>
      )} </Content></Layout></Layout>
    </div>
  );
};

export default FilePage;
