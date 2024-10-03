import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function ExcelToAgGrid({ fileBuffer, onGridUpdate, onAddComment, highlightedCell, commenting }) { // Recevoir "commenting" en prop
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);

  useEffect(() => {
    if (fileBuffer) {
      const workbook = XLSX.read(fileBuffer, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
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
              //mark police cells as red
              return getCellClass(params)==='highlight-cell' ? {backgroundColor: 'yellow'}:null},
        valueFormatter: params => {
          return params.value === '' ? '0' : params.value;
        }
      }));
      setColumnDefs(columns);
      const rows = jsonData.slice(1).map((row) => {
        const rowObject = {};
        columns.forEach((col, index) => {
          rowObject[col.field] = row[index] || ''; 
        });
        return rowObject;
      });
      setRowData(rows);
    }
  }, [fileBuffer, commenting,highlightedCell]);

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
    <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        onCellClicked={onCellClicked}
        onCellValueChanged={onCellValueChanged}
        pagination={true}
        paginationPageSize={10}
        // getCellClass={getCellClass} // Appliquer les classes CSS pour surligner les cellules
      />
    </div>
    
  );
}

export default ExcelToAgGrid;
