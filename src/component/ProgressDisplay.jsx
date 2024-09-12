// src/ProgressDisplay.js
import React from 'react';
import { CircularProgress } from '@mui/material';
import "./ProgressDisplay.css";
const ProgressDisplay = ({ counter, flagAPI,errorcounter }) => {
  return (
    < >
      {flagAPI && (
        <div className="progress-container">
          <h2>Case Progress: {counter}</h2>
          <h2>Error Case Progress: {errorcounter}</h2>
          <CircularProgress />

        </div>
      )}
    </>
  );
};

export default ProgressDisplay;
