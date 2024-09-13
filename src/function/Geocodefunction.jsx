import axios from "axios";
export async function fetchDataForAddress(address) {
  try {
    const apiUrl = 'https://api.leptonmaps.com/v1/geocode';
    // const apiKey = 'efb18de31ee850080a06bcad543153047f10f902430ae26e780b5c98576663d8';
    const apiKey = '5db326e18af22487ba5453570d149cb12c253dbd57a9cd6d478afe43b399c580';
    const headers = {
      accept: 'application/json',
      'x-api-key': apiKey,
    };
    console.log("address: ", address);
    const params = { address };
    const response = await axios.get(apiUrl, { params, headers });
    return response.data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
      console.error('Error details:', error.config);
      if (error.code === 'ERR_NETWORK') {
        console.error('Network error: Check your connection or server availability.');
      }
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }

};
