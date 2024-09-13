import React, { useState, useRef, useCallback } from "react";
import * as XLSX from "xlsx"; //
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import "ag-grid-enterprise";

export function Grid() {
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: "make", editable: true },
    { field: "model", editable: true },
    { field: "price" },
    { field: "electric" },
  ]);

  return (
    // wrapping container with theme & size
    <div
      className="ag-theme-quartz" // applying the Data Grid theme
      style={{ height: 500 }} // the Data Grid will fill the size of the parent container
    >
      <AgGridReact rowData={rowData} columnDefs={colDefs} />
    </div>
  );
}

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

export default function App() {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const gridRef = useRef(null);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
        header: 1,
        raw: false,
      });

      if (jsonData.length === 0) return;

      // Generate dynamic column definitions
      const headers = jsonData[0].map((_, index) => ({
        headerName: `Column ${index + 1}`,
        field: `col${index}`,
        editable: true,
        cellEditor: "agTextCellEditor", // Default editor
        valueFormatter: (params) =>
          formatCellValue(params.value, params.node.data.types[index]), // Use custom formatter
      }));

      // Set row data
      const rows = jsonData.slice(1).map((row) => {
        const rowObject = row.reduce((acc, cell, index) => {
          acc[`col${index}`] = cell;
          return acc;
        }, {});

        rowObject.types = row.map((cell) => detectCellType(cell)); // Store cell types for formatting
        return rowObject;
      });

      setColumnDefs(headers);
      setRowData(rows);
    };

    reader.readAsArrayBuffer(file);
  };

  // Format cell values based on their detected type
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

  // Handle context menu actions
  const getContextMenuItems = (params) => {
    return [
      "copy",
      "paste",
      "cut",
      {
        name: "Change Format",
        subMenu: [
          {
            name: "String",
            action: () =>
              changeCellFormat(params.node, params.column, "string"),
          },
          {
            name: "Number",
            action: () =>
              changeCellFormat(params.node, params.column, "numeric"),
          },
          {
            name: "Date",
            action: () => changeCellFormat(params.node, params.column, "date"),
          },
          {
            name: "Percentage",
            action: () =>
              changeCellFormat(params.node, params.column, "percentage"),
          },
          {
            name: "Currency",
            action: () =>
              changeCellFormat(params.node, params.column, "currency"),
          },
        ],
      },
    ];
  };

  // Change the format of a cell
  const changeCellFormat = (node, column, newType) => {
    const columnIndex = column.getColId().replace("col", "");
    const newData = [...rowData];
    newData[node.rowIndex].types[columnIndex] = newType;
    setRowData(newData);
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <div
        className="ag-theme-alpine"
        style={{ height: "500px", width: "100%" }}
      >
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={{ editable: true }}
          getContextMenuItems={getContextMenuItems} // Custom context menu
        />
      </div>
    </div>
  );
}
