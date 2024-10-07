import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgCharts } from 'ag-charts-react'


function ExcelToAgGrid({ fileBuffer, onGridUpdate, onAddComment, highlightedCell, commenting, charts,setCharts }) { // Recevoir "commenting" en prop
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [chartType, setChartType] = useState('line'); // Type de graphique choisi par l'utilisateur
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [showModal,setShowModal]=useState(false);
  const [activeTab, setActiveTab] = useState(0); // Gérer les onglets
  const [chartTitle, setChartTitle] = useState('Graphique 1');

  useEffect(() => {
    if (fileBuffer) {
      const workbook = XLSX.read(fileBuffer, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const chartsSheet = workbook.Sheets['Charts']; // Feuille contenant les graphiques
      const chartsData = chartsSheet ? XLSX.utils.sheet_to_json(chartsSheet) : [];
      setCharts(chartsData);
  
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const columns = jsonData[0].map((header) => (
        {
        headerName: header,
        field: header,
        editable: !commenting, // Rendre la cellule éditable si on n'est pas en mode commentaire
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: params => {
              return getCellClass(params)==='highlight-cell' ? {backgroundColor: 'yellow'}:null},
        // valueFormatter: params => {
        //   return params.value === '' ? '0' : params.value;
        // }
      }));
      setColumnDefs(columns);
      const rows = jsonData.slice(1).map((row) => {
        const rowObject = {};
        columns.forEach((col, index) => {
          rowObject[col.field] = row[index] //||''; 
        });
        return rowObject;
      });
      setRowData(rows);

  }
  }, [fileBuffer, commenting,highlightedCell]);


  const addChartTab = () => {
    setCharts([...charts, {
      title: `Graphique ${charts.length + 1}`,
      chartOptions: getChartOptions('line', xColumn, yColumn)
    }]);
    setActiveTab(charts.length);
  };

  // Supprimer un onglet
  const removeChartTab = (index) => {
    const newCharts = charts.filter((_, i) => i !== index);
    setCharts(newCharts);
    setActiveTab(0); // Retourner au premier onglet
  };

  // Obtenir les options de graphique
  const getChartOptions = (type, xCol, yCol) => ({
    data: rowData,
    series: [
      {
        type: type,
        xKey: xCol,
        yKey: yCol,
        stroke: 'blue',
      }
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
      },
      {
        type: 'number',
        position: 'left',
      }
    ],
  });

  // Mettre à jour les options du graphique actif
  const updateChartSettings = () => {
    const updatedCharts = [...charts];
    updatedCharts[activeTab].chartOptions = getChartOptions(chartType, xColumn, yColumn);
    updatedCharts[activeTab].title = chartTitle;
    setCharts(updatedCharts);
  };
  
  const onCellClicked = useCallback((params) => {
    console.log(params);
    if (commenting) {
      const { rowIndex, colDef } = params;
      setSelectedCell({ rowIndex, colId: colDef.field });
      const commentText = window.prompt(`Ajouter un commentaire pour la cellule (ligne ${rowIndex + 1}, colonne ${colDef.headerName}):`);
      if (commentText) {
        onAddComment(rowIndex + 1, colDef.field, commentText);
      }
    }
  }, [onAddComment, commenting]);

  const onCellValueChanged = (event) => {
    rowData[event.node.rowIndex]=event.data; 
    console.log("Données mises à jour : ", rowData);

    // Si nécessaire, mettez à jour l'ArrayBuffer ou exécutez une fonction supplémentaire
    onGridUpdate && updateArrayBufferFromTableData(rowData,columnDefs);
  };

  function updateArrayBufferFromTableData(rowData, columnDefs) {
    const worksheetData = [columnDefs.map(colDef => colDef.headerName)];
    
    rowData.forEach(row => {
        let rowArray = [];
        columnDefs.forEach(colDef => {
            rowArray.push(row[colDef.field]);
        });
        worksheetData.push(rowArray);
    });
    
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    // Créer un nouvel ArrayBuffer à partir du workbook
    const updatedArrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    onGridUpdate(updatedArrayBuffer);
}



  const getCellClass = (params) => {
    if (highlightedCell && params.node.rowIndex === highlightedCell.rowIndex-1 && params.colDef.field === highlightedCell.colId) {
      return 'highlight-cell';
    }
    return '';
  };

  return (
    <div>
    <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        onCellClicked={onCellClicked}
        onCellValueChanged={onCellValueChanged}
        pagination={true}
        paginationPageSize={10}
        
      />
    </div>
   {/* Barre d'onglets */}
   <div className="tabs">
        {charts.map((chart, index) => (
          <button
            key={index}
            className={index === activeTab ? 'active' : ''}
            onClick={() => setActiveTab(index)}
          >
            {chart.title}
          </button>
        ))}
        <button onClick={addChartTab}>Ajouter un graphique</button>
      </div>

      {/* Afficher le graphique dans l'onglet actif */}
      {charts.length > 0 && (
        <div>
          <h3>{charts[activeTab].title}</h3>
          <AgCharts options={charts[activeTab].chartOptions} />
          <button onClick={() => removeChartTab(activeTab)}>Supprimer l'onglet</button>
        </div>
      )}

      {/* Configuration des graphiques */}
      <div style={{ marginTop: 20 }}>
        <h4>Configurer les graphiques</h4>
        <label>Nom du graphique :</label>
        <input
          type="text"
          value={chartTitle}
          onChange={(e) => setChartTitle(e.target.value)}
        />

        <label>Type de graphique :</label>
        <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
          <option value="line">Ligne</option>
          <option value="bar">Barres</option>
          <option value="area">Aire</option>
          <option value="scatter">Nuage de points</option>
        </select>

        <label>Colonne pour l'axe X :</label>
        <select value={xColumn} onChange={(e) => setXColumn(e.target.value)}>
          {columnDefs.map((col) => (
            <option key={col.field} value={col.field}>
              {col.headerName}
            </option>
          ))}
        </select>

        <label>Colonne pour l'axe Y :</label>
        <select value={yColumn} onChange={(e) => setYColumn(e.target.value)}>
          {columnDefs.map((col) => (
            <option key={col.field} value={col.field}>
              {col.headerName}
            </option>
          ))}
        </select>

        <button onClick={updateChartSettings}>Appliquer</button>
      </div>
    </div>
    
  );
}

export default ExcelToAgGrid;
