import { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import FileUploader from './FileUploader';
import ProgressDisplay from './ProgressDisplay';
import DataViewer from './DataViewer';
import './GeocodeNatcat.css';

function GeocodeNatcat() {
  const [excelFile, setExcelFile] = useState(null);
  const [fileName, setFileName] = useState(''); // Added state for file name
  const [typeError, setTypeError] = useState(null);
  const [counter, setCounter] = useState(0);
  const [exportedData, setExportedData] = useState(null);
  const [flagAPI, setFlagAPI] = useState(false);
  const [excelData, setExcelData] = useState(null);

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
        setTypeError('Please select only excel file types');
        setExcelFile(null);
        setFileName(''); // Clear the file name on error
      }
    }
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile) {
      const workbook = XLSX.read(excelFile, { type: 'buffer' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data);
    }
  };

  const fetchDataForRow = async (row) => {
    try {
      const apiUrl = 'https://api.leptonmaps.com/v1/tata_aig/risk/natural_disasters';
      const apiKey = '5db326e18af22487ba5453570d149cb12c253dbd57a9cd6d478afe43b399c580';  
      const headers = {
        accept: 'application/json',
        'x-api-key': apiKey,
      };
      const params = { address: row };
      const response = await axios.get(apiUrl, { params, headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching data for row:', row, error);
      return null;
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
      const respdata = await fetchDataForRow(row.Addresses);
      if (respdata) {
        setCounter((prevCounter) => prevCounter + 1);
        exportedRows.push({
          Addresses: row.Addresses,
          Lat: respdata.address.lat,
          Long: respdata.address.lng,
          confidence_radius: respdata.address.confidence_radius,
          location_type: respdata.address.location_type,
          formatted_address: respdata.address.formatted_address,
          cyclone: respdata.risk.cyclone.value,
          cyclone_description: respdata.risk.cyclone.description,
          earthquake: respdata.risk.earthquake_zone.value,
          Peak_ground_acceleration: respdata.risk.earthquake.value,
          flood: respdata.risk.flood.value,
          flood_description: respdata.risk.flood.description,
          rainfall_mm: respdata.risk.rainfall.value,
          distance_to_fire_stations_m: respdata.distance.distance_to_fire_stations,
          distance_to_lakes_and_beaches_m: respdata.distance.distance_to_lakes_and_beaches,
          distance_to_lpg_gas_stations_m: respdata.distance.distance_to_lpg_gas_stations,
          distance_to_petrol_and_cng_stations_m: respdata.distance.distance_to_petrol_and_cng_stations,
          distance_to_seaports_m: respdata.distance.distance_to_seaports,
          distance_to_banks_m: respdata.distance.distance_to_banks,
          distance_to_hospitals_m: respdata.distance.distance_to_hospitals,
        });
      }
    }
    setExportedData(exportedRows);
    setExcelData(null);
    setFlagAPI(false);
  };

  const handleClick = () => {
    exportToExcel(exportedData);
  };

  const exportToExcel = (data) => {
    if (!fileName) {
      alert('No file uploaded');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
    const exportFileName = `exportedNatCat_${fileName}`;
    XLSX.writeFile(workbook, exportFileName);
  };

  return (
    <div className="wrapper">
      <FileUploader
        handleFile={handleFile}
        handleFileSubmit={handleFileSubmit}
        typeError={typeError}
        handleExportClick={handleExportClick}
        handleClick={handleClick}
        text={"Get Geocode & Natcat"}
      />
      <ProgressDisplay counter={counter} flagAPI={flagAPI} />
      <DataViewer excelData={excelData} />
      <DataViewer excelData={exportedData} />
    </div>
  );
}

export default GeocodeNatcat;
