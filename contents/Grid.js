import React, { useState, useRef, useCallback } from "react";
import * as XLSX from "xlsx"; //
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

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

export default function App() {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [cellFormats, setCellFormats] = useState({}); // State to store cell formats
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    cellKey: null,
  }); // State for context menu
  const gridRef = useRef(null);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      if (jsonData.length === 0) return; // No data

      const rows = jsonData.map((row) =>
        row.map((cell) => {
          // Determine cell type and handle empty cells
          if (cell === null || cell === undefined || cell === "") {
            return ""; // Handle empty cells
          } else if (!isNaN(cell)) {
            return parseFloat(cell); // Convert numeric values
          } else {
            return cell; // Keep as string
          }
        })
      );

      // Generate column definitions
      const headers = rows[0].map((_, index) => ({
        headerName: `Column ${index + 1}`,
        field: `col${index}`,
        editable: true,
        cellRenderer: "formatCellRenderer", // Use custom cell renderer
        type:
          typeof rows[1] && typeof rows[1][index] === "number"
            ? "numericColumn"
            : "textColumn",
      }));

      // Set column definitions and row data
      setColumnDefs(headers);
      setRowData(
        rows.slice(1).map((row) =>
          row.reduce((acc, cell, index) => {
            acc[`col${index}`] = cell;
            return acc;
          }, {})
        )
      );
    };

    reader.readAsArrayBuffer(file);
  };

  // Function to format cell based on the stored format
  const formatCellRenderer = (params) => {
    const cellKey = `${params.node.rowIndex}-${params.colDef.field}`;
    const format = cellFormats[cellKey];

    if (
      params.value === "" ||
      params.value === null ||
      params.value === undefined
    ) {
      return ""; // Handle empty cells
    }

    if (format === "date" && !isNaN(params.value)) {
      const dateNumber = parseFloat(params.value);
      const date = new Date(Date.UTC(1900, 0, dateNumber - 1)); // Convert from Excel date number to JS Date
      return date.toISOString().split("T")[0]; // Format to YYYY-MM-DD
    } else if (format === "currency" && !isNaN(params.value)) {
      // Convert to currency format
      return `$${parseFloat(params.value).toFixed(2)}`;
    } else if (format === "percent" && !isNaN(params.value)) {
      // Convert to percentage format
      return `${(parseFloat(params.value) * 100).toFixed(2)}%`;
    }

    return params.value.toString(); // Default to original string value
  };

  // Function to handle format change
  const handleFormatChange = (newFormat) => {
    if (!contextMenu.cellKey) return;
    setCellFormats((prevFormats) => {
      const updatedFormats = {
        ...prevFormats,
        [contextMenu.cellKey]: newFormat,
      };
      // Refresh specific cell after updating format
      gridRef.current.api.refreshCells({
        rowNodes: [
          gridRef.current.api.getRowNode(contextMenu.cellKey.split("-")[0]),
        ],
        columns: [contextMenu.cellKey.split("-")[1]],
      });
      return updatedFormats;
    });
    setContextMenu({ visible: false, x: 0, y: 0, cellKey: null }); // Hide context menu after selection
  };

  // Function to handle right-click (context menu)
  const onCellContextMenu = (params) => {
    params.event.preventDefault(); // Prevent default right-click menu
    const cellKey = `${params.node.rowIndex}-${params.colDef.field}`;
    setContextMenu({
      visible: true,
      x: params.event.clientX,
      y: params.event.clientY,
      cellKey,
    });
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <div
        className="ag-theme-alpine"
        style={{ height: "500px", width: "100%" }}
        onContextMenu={(e) => e.preventDefault()} // Disable default context menu in the grid area
      >
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={rowData}
          frameworkComponents={{ formatCellRenderer }} // Register the custom renderer
          defaultColDef={{ editable: true }}
          onCellContextMenu={onCellContextMenu} // Handle right-click event
        />
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          style={{
            position: "absolute",
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
            backgroundColor: "white",
            border: "1px solid #ccc",
            zIndex: 1000,
          }}
        >
          <button onClick={() => handleFormatChange("date")}>
            Set as Date
          </button>
          <button onClick={() => handleFormatChange("currency")}>
            Set as Currency
          </button>
          <button onClick={() => handleFormatChange("percent")}>
            Set as Percent
          </button>
        </div>
      )}
    </div>
  );
}
