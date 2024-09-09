import React from "react";
import Button from "./Button";
import './FileUploader.css'; // Ensure to import the CSS file for styling

const FileUploader = ({
  handleFile,
  handleFileSubmit,
  typeError,
  isAdresscolumn,
  handleExportClick,
  handleClick,
  text,
}) => {
  return (
    <div className="file-uploader">
      <div className="form-upload-container">
        <h3>Address file (.xlsx/.csv)</h3>
        <form className="custom-form" onSubmit={handleFileSubmit}>
          <input
            type="file"
            className="form-control"
            required
            onChange={handleFile}
          />
          <button type="submit" className="btn btn-success">
            UPLOAD
          </button>

          {typeError && (
            <div className="alert alert-danger" role="alert">
              {typeError}
            </div>
          )}
          {!isAdresscolumn && (
            <div className="alert alert-danger" role="alert">
              Addresses column not available. please check file name and column
            </div>
          )}
        </form>
      </div>

      <div className="button-container">
        <Button
          submit={handleExportClick}
          text= {text}
          disabled={!isAdresscolumn}
        />
        <Button submit={handleClick} text="EXPORT" disabled={!isAdresscolumn}/>
      </div>
    </div>
  );
};

export default FileUploader;
