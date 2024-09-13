import { useState } from 'react';
import * as XLSX from 'xlsx';
import FileUploader from './FileUploader';
import ProgressDisplay from './ProgressDisplay';
import DataViewer from './DataViewer';
import './GeocodeNatcat.css';
import AddressInput from './AddressInput';
import Button from './Button';
import { fetchDataForAddress } from '../function/Geocodefunction';
function GeoCode() {  
  const [excelFile, setExcelFile] = useState(null);
  const [fileName, setFileName] = useState(''); // Added state for file name
  const [typeError, setTypeError] = useState(null);
  const [counter, setCounter] = useState(0);
  const [errorcounter, setErrorcounter] = useState(0);
  const [exportedData, setExportedData] = useState(null);
  const [flagAPI, setFlagAPI] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [excelData, setExcelData] = useState(null);
  const [isAdresscolumn,setIsAdresscolumn]=useState(true);
  const [text_t,setText_t]=useState("Upload file");


   

  const handleAddressSubmit = async (address) => {
    setFlagAPI(true);
    setExcelData(null);
    setExportedData(null);
    const data = await fetchDataForAddress(address);
    setCounter(1);
    if (data) {
      setExportedData(
         [{
        Address: address,
        Lat: data.lat,
        Long: data.lng,
        confidence_radius: data.confidence_radius,
        location_type: data.location_type,
        formatted_address: data.formatted_address,
      }]);
    }
    setFlagAPI(false);
  };
  const handleFile = (e) => {
    let fileTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        setFileName(selectedFile.name); // Set the file name
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        };
      } else {
        setIsAdresscolumn(true);
        setTypeError('Please select only excel file types');
        setExcelFile(null);
        setFileName(''); // Clear the file name on error
      }
    }
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    setIsAdresscolumn(true);
    if (excelFile) {
      const workbook = XLSX.read(excelFile, { type: 'buffer' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      if(!data[0].Addresses){
        setIsAdresscolumn(false);
      }
      if(data[0].Addresses){
        setIsAdresscolumn(true); 
      }
      setExcelData(data);
    }
  };

  const handleExportClick = async () => {
    setFlagAPI(true);
    const exportedRows = [];
    if (!excelData) {
      alert('Upload an Excel file first');
      setFlagAPI(false);
      return;
    }
    for (const row of excelData) {
      const respdata = await fetchDataForAddress(row.Addresses);
      setCounter((prevCounter) => prevCounter + 1);

      if (respdata) {
        exportedRows.push({
          ...row,
          Lat: respdata.lat,
          Long: respdata.lng,
          confidence_radius: respdata.confidence_radius,
          location_type: respdata.location_type,
          formatted_address: respdata.formatted_address,
        });

      }else{
        setErrorcounter((prevCounter) => prevCounter + 1);

      } 
      setExportedData(exportedRows);
    }
    setExcelData(null);
    setFlagAPI(false);
  };

  const handleClick = () => {
    exportToExcel(exportedData);
  };

  const exportToExcel = (data) => {
    if (!fileName ) {
      alert('No file uploaded');
      return;
    }
    if (!data) {
      alert('Geocode not done');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
    const exportFileName = `exported_Geocode_${fileName}`;
    XLSX.writeFile(workbook, exportFileName);
  };
  const setToggleandText=()=>{
    setExcelData(null);
    setToggle(!toggle);
    if(text_t==="Upload file"){
      setText_t("Type Address")
    }else{
      setText_t("Upload file")
    }
  }
  return (
    <div className="wrapper">
      <Button submit={setToggleandText} text={text_t}/>
      
     {toggle? (<AddressInput onSubmit={handleAddressSubmit} text={"GeoCode"}/>):(
      <FileUploader
        handleFile={handleFile}
        handleFileSubmit={handleFileSubmit}
        typeError={typeError}
        handleExportClick={handleExportClick}
        handleClick={handleClick}
        text={"Geocode"}
        isAdresscolumn={isAdresscolumn}
      />)}
      <ProgressDisplay counter={counter} flagAPI={flagAPI} errorcounter={errorcounter}/>
      <DataViewer excelData={exportedData} />
      <DataViewer excelData={excelData} />
    </div>
  );
}

export default GeoCode;
