const axios = require('axios');

// Function to send POST request
async function postData() {
  try {
    const headers = {
      'Host': 'pieraksts.mfa.gov.lv',
      'Cookie': '_csrf-mfa-scheduler=74d00813af4c26ca6babe8b0da7354b2755e5e8d2c0b0e7b0061fb7db2af62b1a%3A2%3A%7Bi%3A0%3Bs%3A19%3A%22_csrf-mfa-scheduler%22%3Bi%3A1%3Bs%3A32%3A%225_tMlSVA1Oxm0xyTpj4UYBBN2dbtfw2o%22%3B%7D; mfaSchedulerSession=0it7huqpj23aanut31r159rlic',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Origin': 'https://pieraksts.mfa.gov.lv',
      'Referer': 'https://pieraksts.mfa.gov.lv/en/india/step2',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-User': '?1',
      'Te': 'trailers',
      'Connection': 'keep-alive'
    };

    const params = {
      '_csrf-mfa-scheduler': 'pH_6xE1LNWL0idRxRHfyPJJLhmfGHiyResQ5ucTyfLyRII6JIRhjI8XGrBx0D4to4iGyMp9cbt9IoFvNooVO0w==',
      'Persons[0][service_ids][]': '619',
      'Persons[0][service_ids][]': '682',
      'Persons[0][service_ids][]': '618',
      'Persons[0][service_ids][]': '621'
    };

    const encodedParams = new URLSearchParams(params).toString();

    const response = await axios.post('https://pieraksts.mfa.gov.lv/en/india/step2', encodedParams, { headers });

    if (response.status === 302) {
      console.log('Redirection successful:', response.headers['location']);
    } else {
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

// Run the function
postData();
