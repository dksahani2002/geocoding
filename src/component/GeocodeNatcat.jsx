import { useState } from 'react';
import * as XLSX from 'xlsx';
import FileUploader from './FileUploader';
import ProgressDisplay from './ProgressDisplay';
import DataViewer from './DataViewer';
import './GeocodeNatcat.css';
import Button from './Button';
import AddressInput from './AddressInput';
import { fetchDataForAddress } from '../function/GeoNatcatfunction';
function GeocodeNatcat() {
  const [excelFile, setExcelFile] = useState(null);
  const [fileName, setFileName] = useState(''); // Added state for file name
  const [typeError, setTypeError] = useState(null);
  const [counter, setCounter] = useState(0);
  const [errorcounter, seterrorcounter] = useState(0);
  const [exportedData, setExportedData] = useState(null);
  const [flagAPI, setFlagAPI] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [excelData, setExcelData] = useState(null);
  const [isAdresscolumn, setIsAdresscolumn] = useState(true);
  const [text_t, setText_t] = useState("Upload file");

  const handleAddressSubmit = async (address) => {
    setFlagAPI(true);
    setExcelData(null);
    setExportedData(null);
    const respdata = await fetchDataForAddress(address);
    setCounter(1);
    if (respdata) {
      setExportedData(
        [{
          Address: address,
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
        }]);
    }
    setFlagAPI(false);
  }
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
      console.log("data: ", data);
      if (!data[0].Addresses) {
        setIsAdresscolumn(false);
      }
      if (data[0].Addresses) {
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
      if (respdata) {
        setCounter((prevCounter) => prevCounter + 1);
        exportedRows.push({
          ...row,
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
        setExportedData(exportedRows);

      } else {
        // setCounter((prevCounter) => 0);
        seterrorcounter((prevCounter) => prevCounter + 1);
        setFlagAPI(false);
      }
    }
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
  const setToggleandText = () => {
    setToggle(!toggle);
    if (text_t === "Upload file") {
      setText_t("Type Address")
    } else {
      setText_t("Upload file")
    }
  }
  return (
    <div className="wrapper">
      <Button submit={setToggleandText} text={text_t} />
      {toggle ? (<AddressInput onSubmit={handleAddressSubmit} text={"GeocodeNatcat"}/>) : (
        <FileUploader
          handleFile={handleFile}
          handleFileSubmit={handleFileSubmit}
          typeError={typeError}
          handleExportClick={handleExportClick}
          handleClick={handleClick}
          text={"Geocode & Natcat"}
          isAdresscolumn={isAdresscolumn}
        />
      )
      }

      <ProgressDisplay counter={counter} flagAPI={flagAPI} errorcounter={errorcounter} />
      <DataViewer excelData={exportedData} />
      <DataViewer excelData={excelData} />
    </div>
  );
}

export default GeocodeNatcat;
