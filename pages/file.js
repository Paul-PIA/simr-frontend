import React, { useEffect, useState} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import { apiClient, apiClientGetFile } from '../services/api';
import * as XLSX from 'xlsx';

const FilePage = () => {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [fileDetails, setfileDetails] = useState({});

  const detectCellType = (cell) => {
    if (cell === null || cell === undefined || cell === "") {
      return "empty";
    } else if (!isNaN(cell)) {
      return "numeric";
    } else if (typeof cell === "string" && Date.parse(cell)) {
      return "date";
    } else {
      return "string";
    }
  };
  
  const convertExcelToGridData = (jsonData) => {
    if (!jsonData || jsonData.length === 0) {
      return { columns: [], rows: [] };
    }
  
    // 1. Créer les définitions de colonnes dynamiques
    const headers = jsonData[0].map((_, index) => ({
      headerName: `Column ${index + 1}`,  // Utiliser le nom des colonnes par défaut ou personnaliser selon votre besoin
      field: `col${index}`,  // Champ associé aux données
      editable: true,  // Permettre l'édition des cellules
      cellEditor: "agTextCellEditor",  // Utiliser l'éditeur par défaut
      valueFormatter: (params) =>
        formatCellValue(params.value, params.node.data.types[index]),  // Mise en forme personnalisée
    }));
  
    // 2. Convertir les lignes de données
    const rows = jsonData.slice(1).map((row) => {
      const rowObject = row.reduce((acc, cell, index) => {
        acc[`col${index}`] = cell;  // Associer chaque cellule à un champ dans l'objet de la ligne
        return acc;
      }, {});
  
      // Stocker les types de chaque cellule pour formater correctement les données
      rowObject.types = row.map((cell) => detectCellType(cell));
      return rowObject;
    });
  
    return { columns: headers, rows: rows };
  };
  
  const formatCellValue = (value, type) => {
    switch (type) {
      case "numeric":
        return !isNaN(value) ? Number(value).toLocaleString() : value;
      case "date":
        return new Date(value).toLocaleDateString();
      case "percentage":
        return `${parseFloat(value) * 100}%`;
      case "currency":
        return `$${parseFloat(value).toFixed(2)}`;
      default:
        return value;
    }
  };

  useEffect(() => {
    const fetchFile = async () => {
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
      const queryParams = new URLSearchParams(window.location.search);
      const id = queryParams.get('id');

      try {
        const response = await apiClient({
            method:'GET',
            path:`file/${id}/`
        });
        setfileDetails(response);
        console.log(response);
        const fichier=await apiClientGetFile({
          method:'GET',
          path:response.content
        });
  ;
        const data = new Uint8Array(fichier);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // 3. Conversion en données utilisables par AgGrid
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const excelData = convertExcelToGridData(jsonData);

        setRowData(excelData.rows);
        setColumnDefs(excelData.columns);
        console.log(excelData.rows)
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    };

    fetchFile();
  }, []);
  const handleSaveCopy = async () => {
    try {
      await axios.post('/save-copy', { id: fileDetails, data: rowData });
      alert('Copie enregistrée avec succès.');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la copie:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axios.patch(`/file?id=${fileDetails}`, { data: rowData });
      alert('Modifications enregistrées avec succès.');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des modifications:', error);
    }
  };

  // Styles intégrés
  const styles = {
    banner: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px',
      backgroundColor: '#f0f0f0',
    },
    button: {
      padding: '10px',
      border: 'none',
      cursor: 'pointer',
      color: 'white',
    },
    saveCopyButton: {
      backgroundColor: '#007bff',
    },
    saveChangesButton: {
      backgroundColor: '#ff9800',
    },
  };

  return (
    <div className="file-page">
      <div style={styles.banner}>
        <button style={{ ...styles.button, ...styles.saveCopyButton }} onClick={handleSaveCopy}>
          Enregistrer une copie dans mon espace de travail
        </button>
        <button style={{ ...styles.button, ...styles.saveChangesButton }} onClick={handleSaveChanges}>
          Enregistrer les modifications
        </button>
        {/* Ajoutez ici les autres boutons Excel pertinents */}
      </div>

      <div
      className="ag-theme-quartz" // applying the Data Grid theme
      style={{ height: 500 }} // the Data Grid will fill the size of the parent container
    >
      <AgGridReact rowData={rowData} columnDefs={columnDefs} />
    </div>
    </div>
  );
};

export default FilePage;
