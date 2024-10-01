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

      const columns = jsonData[0].map((header) => ({
        headerName: header,
        field: header,
        editable: !commenting, // Rendre la cellule éditable si on n'est pas en mode commentaire
        sortable: true,
        filter: true,
        resizable: true,
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
  }, [fileBuffer, commenting]);

  const onCellClicked = useCallback((params) => {
    if (commenting) {
      const { rowIndex, colDef } = params;
      setSelectedCell({ rowIndex, colId: colDef.field });
      const commentText = window.prompt(`Ajouter un commentaire pour la cellule (ligne ${rowIndex + 1}, colonne ${colDef.headerName}):`);
      if (commentText) {
        onAddComment(rowIndex + 1, colDef.field, commentText);
      }
    }
  }, [onAddComment, commenting]);

  const onCellValueChanged = useCallback((params) => {
    const updatedData = params.api.getDataAsCsv({ onlySelected: false, allColumns: true });
    if (onGridUpdate) {
      onGridUpdate(updatedData);
    }
  }, [onGridUpdate]);

  const getCellClass = (params) => {
    console.log(params);
    if (highlightedCell && params.node.rowIndex === highlightedCell.rowIndex - 1 && params.colDef.field === highlightedCell.colId) {
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
        getCellClass={getCellClass} // Appliquer les classes CSS pour surligner les cellules
      />
    </div>
  );
}

export default ExcelToAgGrid;
