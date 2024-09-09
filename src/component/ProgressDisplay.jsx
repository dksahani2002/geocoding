// src/ProgressDisplay.js
import React from 'react';
import { CircularProgress } from '@mui/material';
import "./ProgressDisplay.css";
const ProgressDisplay = ({ counter, flagAPI }) => {
  return (
    < >
      {flagAPI && (
        <div className="progress-container">
          <h2>Case Progress: {counter}</h2>
          <CircularProgress />
        </div>
      )}
    </>
  );
};

export default ProgressDisplay;
