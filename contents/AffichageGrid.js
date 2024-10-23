import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgCharts } from 'ag-charts-react';
import * as math from 'mathjs';


function ExcelToAgGrid({ fileBuffer, onGridUpdate, onAddComment, highlightedCell, commenting, charts,setCharts }) { // Recevoir "commenting" en prop
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [chartType, setChartType] = useState('line'); // Type de graphique choisi par l'utilisateur
  const [xColumn, setXColumn] = useState(''); //Colonne utilisée pour l'axe X
  const [yColumn, setYColumn] = useState(['']); //Colonnes utilisées pour l'axe Y
  const [activeTab, setActiveTab] = useState(0); // Gérer les onglets
  const [chartTitle, setChartTitle] = useState('Graphique 1');
  const [gridApi, setGridApi] = useState(null); // Garde l'API du tableau
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [stats,setStats]=useState({});

  useEffect(() => {
    if (fileBuffer) {
      const worksheet = fileBuffer.Sheets[fileBuffer.SheetNames[0]];
      const chartsSheet = fileBuffer.Sheets['Charts']; // Feuille contenant les graphiques
  
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
        valueParser: (params) => {
                const value = params.newValue;
          
                if (value[0]=='=') {
                  // Traite l'expression comme une formule
                  return value; // Retourner la formule sans la parser
                } else if (!isNaN(value)) {
                  // Si c'est un nombre, le convertir en float
                  return parseFloat(value);
                } //Cas des dates:new Date((Month-17899)* 24 * 60 * 60 * 1000).toLocaleDateString()
                return value; // Pour les autres cas (comme des chaînes de texte)
              }
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
      const chartsData = chartsSheet ? XLSX.utils.sheet_to_json(chartsSheet) : [];
      if (xColumn=='' && yColumn[0]==''){
      if (chartsData.length>0){
        setXColumn(chartsData[activeTab].X);
        setYColumn(JSON.parse(chartsData[activeTab].Y));
        setChartTitle(chartsData[activeTab].title);
        setChartType(chartsData[activeTab].Type)
      }
      else if (columns.length > 1) {
        setXColumn(columns[0].field);
        setYColumn([columns[1].field]);
      }}
      const Graphs=chartsData.map((chart)=>{return {title:chart.title,chartOptions:getChartOptions(chart.Type,chart.X,JSON.parse(chart.Y))}})
      setCharts(Graphs);

      if (stats['colonne']){
        setStats(CalculStatistiques(stats['colonne'])) //Met à jour les statistiques pour tenir compte des nouvelles données
      }
      else{setStats(CalculStatistiques(columns[0].field))} //Initialise les statistiques pour un meilleur confort utilisateur
  }
  }, [fileBuffer, commenting,highlightedCell]);


  const addChartTab = () => {
    setCharts([...charts, {
      title: `Graphique ${charts.length + 1}`,
      chartOptions: getChartOptions('line', xColumn, yColumn)
    }]);
    setChartTitle(`Graphique ${charts.length + 1}`)
    setActiveTab(charts.length);
  };

  // Supprimer un onglet
  const removeChartTab = (index) => {
    const newCharts = charts.filter((_, i) => i !== index);
    setCharts(newCharts);
    setActiveTab(activeTab>1 ? activeTab-1:0); 
  };

  // Obtenir les options de graphique
  const getChartOptions = (type, xCol, yCol) => {return{
    data: rowData,
    series: yCol.length==0? [{type:type,xKey:xCol,yKey:null}]:yCol.map((y)=>
      {return{
        type: type,
        xKey: xCol,
        yKey: y,
        //stroke: 'blue',
      }})
    ,
    axes: [
      {
        type: rowData[0] && typeof rowData[0][xCol]=='number'? 'number' : 'category',
        //type:'number',
        position: 'bottom',
        label:{fontSize:10,  formatter: (params) => {
          const label = params.value;
          const maxLabelLength = 10;  // Limite de caractères
          return label.length > maxLabelLength ? label.substring(0, maxLabelLength) + '...' : label;
      }}
      },
      {
        type: 'number',
        position: 'left',
      }
    ],
  //   padding: {
  //     bottom: 20,  // Ajoute de l'espace en bas du graphique pour les étiquettes
  // }
  }};

  // Mettre à jour les options du graphique actif
  const updateChartSettings = () => {
    const updatedCharts = [...charts];
    updatedCharts[activeTab].chartOptions = getChartOptions(chartType, xColumn, yColumn);
    updatedCharts[activeTab].title = chartTitle;
    setCharts(updatedCharts);
    onGridUpdate && updateArrayBufferFromTableData(rowData,columnDefs,charts)
  };

  useEffect(()=>{ if (charts[activeTab]){updateChartSettings()}},[xColumn,yColumn,chartType,chartTitle]);

  const CalculStatistiques=(column)=>{
    try{
    const data={};
    const valeurs=rowData.map((row)=>row[column]).sort(); //Liste triée des valeurs de la colonne
    data['colonne']=column;
    data['moyenne']=math.mean(valeurs);
    data['variance']=valeurs.reduce((previousValue,row)=>previousValue+(row-data["moyenne"])**2,0)/(valeurs.length-1);
    data["écart-type"]=math.sqrt(data['variance']);
    data["min"]=valeurs[0];
    [data["quantile 1"],data["médiane"],data["quantile 3"]]=math.quantileSeq(valeurs,[0.25,0.5,0.75]);
    data["max"]=valeurs[valeurs.length-1]
    return data}
    catch(error){
      return {"colonne":column,"erreur":`'${column}' n'est pas une colonne de nombres`}
    }
  }
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

  const CalculateNewValue=(value,index)=>{
    if (typeof value=="string" && value[0]=="="){ //Si c'est une expression, on la calcule
      const expression = value.slice(1);
      const variables = {};
      columnDefs.forEach((column)=>variables[column.field]=rowData[index][column.field]);
      const evaluatedExpression = expression.replace(
        new RegExp(Object.keys(variables).join("|"), "g"),
        (match) => variables[match]
      );
      return math.evaluate(evaluatedExpression) //Permet d'utiliser les fonctions mathématiques usuelles, comme sin ou exp
    }
    else {
    return value; 
    }
  }

  const ExcelDate=(value)=>{
    const startDate = new Date(1900, 0, 1); // Date de départ : 1 janvier 1900
    return new Date(startDate.getTime() + (value - 2) * 24 * 60 * 60 * 1000).toLocaleDateString();
  }

  const onCellValueChanged = (event) => {
    const data=event.data; 
    const col=event.colDef.field;
    const index=event.node.rowIndex;
    rowData[index][col]=CalculateNewValue(data[col],index)

    // Si nécessaire, mettez à jour l'ArrayBuffer ou exécutez une fonction supplémentaire
    onGridUpdate && updateArrayBufferFromTableData(rowData,columnDefs,charts)
  };

  function updateArrayBufferFromTableData(rowData, columnDefs,charts) {
    const worksheetData = [columnDefs.map(colDef => colDef.headerName)];
    
    rowData.forEach(row => {
        let rowArray = [];
        columnDefs.forEach(colDef => {
            rowArray.push(row[colDef.field]);
        });
        worksheetData.push(rowArray);
    });
    
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Créer une nouvelle feuille pour les graphiques (ChartsData)
    const chartsData = [["title", "Type", "X", "Y"]]; // En-têtes pour la feuille des graphiques
    const noms_colonnes=columnDefs.map(column=>column.field);
    charts.forEach(chart => {
      {
        chartsData.push([
            chart.title,            // Titre du graphique
            chart.chartOptions.series[0].type,  // Type de graphique (ligne, barres, etc.)
            chart.chartOptions.series[0].xKey,  // Colonne pour X
            JSON.stringify(
              chart.chartOptions.series.map(graph=>graph.yKey).filter(y=>noms_colonnes.includes(y)))  // Colonnes pour Y. JSON permet de socker une liste dans un Excel
        ])};
    });

    const chartsWorksheet = XLSX.utils.aoa_to_sheet(chartsData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.utils.book_append_sheet(workbook, chartsWorksheet, 'Charts');
    
    onGridUpdate(workbook);
}

const handlegraphchange=(index,chart)=>{
  setActiveTab(index);
  setXColumn(chart.chartOptions.series[0].xKey);
  setYColumn(chart.chartOptions.series.map((graph)=>graph.yKey));
  setChartTitle(chart.title);
  setChartType(chart.chartOptions.series[0].type)
}

  const getCellClass = (params) => {
    if (highlightedCell && params.node.rowIndex === highlightedCell.rowIndex-1 && params.colDef.field === highlightedCell.colId) {
      return 'highlight-cell';
    }
    return '';
  };
  const handleColumnNameChange = (newName, colIndex) => {
    const updatedColumnDefs = [...columnDefs];
    updatedColumnDefs[colIndex].headerName = newName; // Met à jour le nom de la colonne
    setColumnDefs(updatedColumnDefs); // Réapplique les colonnes
  };

  const addNewRow = () => {
    const newRow={};
    columnDefs.forEach((col)=>newRow[col.field]=null);
    rowData.push(newRow);
    onGridUpdate && updateArrayBufferFromTableData(rowData,columnDefs,charts)
  };

  const addNewColumn = () => {
    const newname=window.prompt('Donner un nom à la nouvelle colonne');
    if (newname){
      const newValue=window.prompt(
'Donner une valeur par défaut à vos nouvelles cases ? Pour calculer à partir d\'autres colonnes, rajoutez un "="\n Si une colonne est censée afficher une date mais ne le fait pas, essayez =ExcelDate(nom_colonne)'
      );
    const newColumn = {
      headerName: newname,
      field: newname,
      editable: !commenting,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: params => {
          return getCellClass(params)==='highlight-cell' ? {backgroundColor: 'yellow'}:null},
        valueParser: (params) => {
            const value = params.newValue;
      
            if (value[0]=='=') {

              return value;
            } else if (!isNaN(value)) {

              return parseFloat(value);
            }
            return value
          }
    };
    columnDefs.push(newColumn);
    if (newValue){
      rowData.forEach((_,index)=>rowData[index][newname]=CalculateNewValue(newValue,index))
    }
    onGridUpdate && updateArrayBufferFromTableData(rowData,columnDefs,charts)
  }};

    // Fonction pour supprimer une ligne
    const deleteRows = () => {
      const selectedRows = gridApi.getSelectedRows(); // Obtenir les lignes sélectionnées
  const updatedRowData = rowData.filter(row => !selectedRows.includes(row)); // Filtrer les lignes non sélectionnées
  setRowData(updatedRowData); // Mettre à jour les données du tableau
  onGridUpdate && updateArrayBufferFromTableData(updatedRowData, columnDefs, charts)
    };
  
    // Fonction pour supprimer une colonne
    const deleteColumn = (selectedCol) => {
      if (selectedCol !== null) {
        const updatedColumnDefs = columnDefs.filter((col, index) => index !== selectedCol);
        const updatedRowData = rowData.map(row => {
          const updatedRow = { ...row };
          delete updatedRow[columnDefs[selectedCol].field]; // Supprime les données de cette colonne
          return updatedRow;
        });
        setColumnDefs(updatedColumnDefs);
        setRowData(updatedRowData);
        onGridUpdate && updateArrayBufferFromTableData(updatedRowData, updatedColumnDefs, charts); // Met à jour le backend
      } else {
        alert("Veuillez sélectionner une colonne à supprimer.");
      }
    };

    const onSortChanged=(event)=>{
      const sortedData = [];
      event.api.forEachNodeAfterFilterAndSort((node) => {
        sortedData.push(node.data); // Ajoute la donnée de chaque ligne visible à sortedData
      });
      setRowData(sortedData);
      onGridUpdate && updateArrayBufferFromTableData(rowData,columnDefs,charts)
      }

      const styles = {
        button: {
          padding: '10px',
          border: 'none',
          cursor: 'pointer',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px'
        },
        modal: {
          position: 'fixed',  // Fixe la modale à la fenêtre
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000 // Pour s'assurer que la modale soit au-dessus du reste du contenu
        },
        modalContent: {
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          zIndex: 1001  // S'assurer que le contenu soit au-dessus de tout
        },
        closeButton: {
          backgroundColor: 'white',
          color: '#000',
          border: '1px solid #ccc',
          padding: '5px 10px',
          cursor: 'pointer',
          marginRight: '10px',
        }
      };

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px' }}>
      <button onClick={addNewRow} style={{ ...styles.button, backgroundColor: '#2196F3' }}>Ajouter une ligne</button>
      <button onClick={addNewColumn} style={{ ...styles.button, backgroundColor: '#FF5722' }}>Ajouter une colonne</button>
      <button onClick={deleteRows} style={{ ...styles.button, backgroundColor: '#f44336' }}>
        Supprimer les lignes sélectionnées
      </button>
      <button onClick={()=>setIsStatModalOpen(true)} style={{ ...styles.button, backgroundColor: '#2196F3' }}>Voir des statistiques</button>
      </div>
      <br></br>
      <div style={{ display: 'flex', gap: '10px',overflowX:'auto' }}>
      {columnDefs.map((colDef, index) => (
    <div key={index}>
      <input
        type="text" style={{maxWidth: '200px', maxWidth: '130px'}}
        value={colDef.headerName}
        onChange={(e) => handleColumnNameChange(e.target.value, index)}
        placeholder={`Nom de la colonne ${index + 1}`}
      />
      <button onClick={()=>deleteColumn(index)} 
      style={{ ...styles.button, backgroundColor: '#f44336', maxWidth: '400px'}}>
        Supprimer {index==0?colDef.headerName:null}</button>
    </div>
  ))} </div>
    <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        onCellClicked={onCellClicked}
        onCellValueChanged={onCellValueChanged}
        pagination={true}
        paginationPageSize={20}
        paginationPageSizeSelector={[10,20,50,100,200,rowData.length].filter((value)=>value<=rowData.length)} //Version modifiée du Stalin sort
        selection={{mode:"multiRow",copySelectedRows:true}}
        onGridReady={(params) => setGridApi(params.api)}
        clipboard={true} // Active la fonctionnalité de copier-coller // Sauvegarde l'API du tableau
        onSortChanged={onSortChanged}
        //enableCellExpressions={true}
      />
    </div>
   {/* Barre d'onglets */}
   <div className="tabs">
        {charts.map((chart, index) => (
          <button
            key={index}
            className={index === activeTab ? 'active' : ''}
            onClick={() => handlegraphchange(index,chart)}
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
          onChange={(e) => {setChartTitle(e.target.value)}}
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

        <label>Colonnes pour l'axe Y :</label>
        <select multiple> 
          {columnDefs.map((col) => (
            <option key={col.field} value={col.field} style={{
              fontWeight: yColumn.includes(col.field) ? 'bold' : 'normal',
              color: yColumn.includes(col.field) ? 'blue' : 'black',
            }}
            onClick={() =>
              yColumn.includes(col.field)
                ? setYColumn(yColumn.filter((value) => value !== col.field)) // Si l'élément est déjà dans yColumns, on l'enlève
                : setYColumn([...yColumn, col.field])  // Sinon, on l'ajoute
            }>
              {col.headerName}
            </option>
          ))}
        </select>

        <button onClick={updateChartSettings}>Appliquer</button>
      </div>
      
      {isStatModalOpen && 
        <div className="modal" style={styles.modal}>
          <div className="modal-content" style={styles.modalContent}>
          <span class="close" style={{'position':'right'}} onClick={()=>setIsStatModalOpen(false)}>&times;</span>
            <h3>Statistiques de la colonne</h3>
            <select onChange={(event)=>setStats(CalculStatistiques(event.target.value))} value={stats['colonne']}>
            {columnDefs.map((col) => (
            <option key={col.field} value={col.field}>
              {col.headerName}
            </option>
          ))}
            </select>
            <ul>
              {Object.keys(stats).map((key) => (
                <li key={key}>
                  <strong>{key}:</strong> {stats[key]}
                </li>
              ))}
            </ul>
            <button onClick={()=>setIsStatModalOpen(false)} style={styles.closeButton}>Fermer</button>
          </div>
        </div>}
    </div>
    
  );
}

export default ExcelToAgGrid;
