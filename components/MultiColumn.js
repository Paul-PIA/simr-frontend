import React from "react";

export const MultiColumn = ({ columns }) => {
  return (
    <>
      <div className="multi-column-layout">
        {columns.map((columnItems, colIndex) => (
          <div key={colIndex} className="column">
            {columnItems.map((item, index) => (
              <div key={index} className="column-item">
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
      <style jsx="true">{`
        .multi-column-layout {
          display: flex;
          width: 100%;
          overflow-x: auto;
          justify-content: center;
          gap: 100px;
        }
        .column {
          display: flex;
          flex-direction: column;
          min-width: 200px;
        }
        .column-item {
          display: inline-block;
          padding: 0px;
          margin: 0px;
          line-height: 1px;
          text-decoration: none;
        }
      `}</style>
    </>
  );
};
