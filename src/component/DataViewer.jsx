// src/DataViewer.js
import React from 'react';
import './DataViewer.css'; 

const DataViewer = ({ excelData }) => {
  return (
      <div className="data-viewer">
        {excelData ? (
          <div className="table-container">
            <table className="table excel-table">
              <thead>
                <tr>
                  <th>#</th> {/* Serial Number Header */}
                  {Object.keys(excelData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.map((individualExcelData, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td> {/* Serial Number */}
                    {Object.keys(individualExcelData).map((key) => (
                      <td key={key}>
                        {individualExcelData[key] ? individualExcelData[key] : "null"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (<div></div>)}
      </div>
  );
};

export default DataViewer;
