import React from "react";
import Button from "./Button";
import './FileUploader.css'; // Ensure to import the CSS file for styling

const FileUploader = ({
  handleFile,
  handleFileSubmit,
  typeError,
  handleExportClick,
  handleClick,
  text,
}) => {
  return (
    <div className="file-uploader">
      <div className="form-upload-container">
        <h3>Address file (.xlsx)</h3>
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
        </form>
      </div>

      <div className="button-container">
        <Button
          submit={handleExportClick}
          text= {text}
        />
        <Button submit={handleClick} text="EXPORT" />
      </div>
    </div>
  );
};

export default FileUploader;
