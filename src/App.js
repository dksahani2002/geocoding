import { useState } from "react";
import * as XLSX from 'xlsx';
import axios from "axios";
import { CircularProgress } from '@mui/material';
function App() {

  // onchange states
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [counter, setCounter] = useState(0);
  const [exportedData, setExportedData] = useState(null);
  const [flagAPI,setFlagAPI]=useState(false);


  // submit state
  const [excelData, setExcelData] = useState(null);

  // onchange event
  const handleFile=(e)=>{
    let fileTypes = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv'];
    let selectedFile = e.target.files[0];
    if(selectedFile){
      if(selectedFile&&fileTypes.includes(selectedFile.type)){
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload=(e)=>{
          setExcelFile(e.target.result);
        }
      }
      else{
        setTypeError('Please select only excel file types');
        setExcelFile(null);
      }
    }
    else{
      console.log('Please select your file');
    }
  }
  
  // submit event
  const handleFileSubmit=(e)=>{
   
    e.preventDefault();
    if(excelFile!==null){
      const workbook = XLSX.read(excelFile,{type: 'buffer'});
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data);
      console.log(data)
      // data.forEach((row) => {
      //   console.log(row.Addresses)
      //   callYourApi(row.Addresses);
      // });
    }
  }
  const fetchDataForRow = async (row) => {
    try {
      // Replace 'YOUR_API_KEY' with your actual API key
      const apiUrl = 'https://api.leptonmaps.com/v1/tata_aig/risk/natural_disasters';

      // Set your API key
      const apiKey = '5db326e18af22487ba5453570d149cb12c253dbd57a9cd6d478afe43b399c580';
  
      // Set custom headers
      const headers = {
        'accept': 'application/json',
        'x-api-key': apiKey
        // Add any additional headers as needed
      };
      const params = {
        'address': row
      }

      const response = await axios.get(apiUrl, {
        params: params,
        headers: headers,
      });
     
      return response.data; // Adjust this based on your API response structure
    } catch (error) {
      console.error('Error fetching data for row:', row.id, error);
      return null;
    }
  };
  
  const handleExportClick = async () => {
    setFlagAPI(true);
    const exportedRows = [];

    // Loop through each row in excelData and fetch data
    if(!excelData){
      alert("upload excel file ");
      setFlagAPI(false);
      return;
    }
    for (const row of excelData) {
      const respdata = await fetchDataForRow(row.Addresses);
      
      
      if (respdata) {
        // Add the required fields from the fetched data;
        setCounter(counter=>counter+1);
        exportedRows.push({
            Addresses: row.Addresses,
            Lat: respdata.address.lat,
            Long:respdata.address.lng,
            confidence_radius:respdata.address.confidence_radius,
            location_type:respdata.address.location_type,
            formatted_address: respdata.address.formatted_address,
            cyclone: respdata.risk.cyclone.value,
            cyclone_description:respdata.risk.cyclone.description,
            earthquake:respdata.risk.earthquake_zone.value,
            Peak_ground_acceleration:respdata.risk.earthquake.value,
            flood: respdata.risk.flood.value,
            flood_description:respdata.risk.flood.description,
            rainfall_mm: respdata.risk.rainfall.value,
            distance_to_fire_stations_m: respdata.distance.distance_to_fire_stations,
            distance_to_lakes_and_beaches_m:respdata.distance.distance_to_lakes_and_beaches,
            distance_to_lpg_gas_stations_m: respdata.distance.distance_to_lpg_gas_stations,
            distance_to_petrol_and_cng_stations_m:respdata.distance.distance_to_petrol_and_cng_stations,
            distance_to_seaports_m: respdata.distance.distance_to_seaports,
            distance_to_banks_m: respdata.distance.distance_to_banks,
            distance_to_hospitals_m: respdata.distance.distance_to_hospitals
        });
      }
    }

    // Update the state with the exported data
    setExportedData(exportedRows);
    
    setExcelData(null);
    
    // Call a function to export the data to Excel
    setFlagAPI(false);
    
  };
  const handleClick = (e)=>{
    exportToExcel(exportedData);
  }
  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
    XLSX.writeFile(workbook, 'exported_data.xlsx');
  };

  return (
    <div className="wrapper">

      <h3>Upload & View Excel Sheets</h3>

      {/* form */}
      {
            flagAPI && <><CircularProgress/>
                       <h1>Cases counter : {counter}</h1></>
        }
      <form className="form-group custom-form" onSubmit={handleFileSubmit}>
        <input type="file" className="form-control" required onChange={handleFile} />
        <button type="submit" className="btn btn-success btn-md">UPLOAD</button>
        
        {typeError&&(
          <div className="alert alert-danger" role="alert">{typeError}</div>
        )}
      </form>
      <div className="flex">
     <div> <button type="submit" className="btn btn-primary btn-md mr-6"onClick={handleExportClick} >Get geocoded Data</button></div>
     <div className="space"></div>
     <div><button type="submit" className="btn btn-info btn-md mr-6" onClick={handleClick} >EXPORT</button></div>
   
     </div>
     
     

     {/* view data */}
      <div className="viewer">
        
       {excelData?(
          <div className="table-responsive">
            <table className="table">

              <thead>
                <tr>
                  
                    <th>Addresses</th>
                
                </tr>
              </thead>

              <tbody>
                {excelData.map((individualExcelData, index)=>(
                  <tr key={index}>
                  
                      <td>{individualExcelData.Addresses}</td>
                    
                   
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        ):(
          <div>No File is uploaded yet!</div>
        )}
      </div>

      <div className="viewer">
       
        {exportedData?(
           <div className="table-responsive">
             <table className="table">
 
             <thead>
                <tr>
                  {Object.keys(exportedData[0]).map((key)=>(
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {exportedData.map((individualExcelData, index)=>(
                  <tr key={index}>
                    {Object.keys(individualExcelData).map((key)=>(
                      <td key={key}>{individualExcelData[key]?individualExcelData[key]:"null"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
 
             </table>
           </div>
         ):(
           <div>{!flagAPI && "No API response"}</div>
          
         )}
       </div>
      
    </div>
  );
}

export default App;
