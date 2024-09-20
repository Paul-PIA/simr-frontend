import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import { apiClient } from '../services/api';

const FilePage = () => {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [fileId, setFileId] = useState(null);

  useEffect(() => {
    const fetchFile = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const id = queryParams.get('id');
      setFileId(id);

      try {
        const response = await apiClient({
            method:'GET',
            path:`file/${fileId}/`
        });
        const excelData = convertExcelToGridData(response.content);

        setRowData(excelData.rows);
        setColumnDefs(excelData.columns);
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    };

    fetchFile();
  }, []);

  const convertExcelToGridData = (content) => {
    // Implémentation de conversion Excel vers rowData et columnDefs
    // Vous pouvez utiliser xlsx ou une autre librairie
    // Retourne un objet { columns, rows }
  };

  const handleSaveCopy = async () => {
    try {
      await axios.post('/save-copy', { id: fileId, data: rowData });
      alert('Copie enregistrée avec succès.');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la copie:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axios.patch(`/file?id=${fileId}`, { data: rowData });
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

      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ editable: true }}
        />
      </div>
    </div>
  );
};

export default FilePage;
