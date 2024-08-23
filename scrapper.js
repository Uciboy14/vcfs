require('dotenv').config();
const axios = require('axios');

(async () => {
  try {
    // Define the parameters
    const params = {
      'branch_office_id': '15',
      '_csrf-mfa-scheduler': 'ghewpA4VmYtbahcRZwuoNGuMS5F7MWHNmG6wVK2zDUC3SMTpYkbPymolb3xXc9FgG-Z_xCJzI4OqCtIgy8Q_Lw==',
      'Persons[0][first_name]': 'chance',
      'Persons[0][last_name]': 'boiler',
      'e_mail': 'chanceboiler@gmail.com',
      'e_mail_repeat': 'chanceboiler@gmail.com',
      'phone': '+23490337883'
    };

    // Encode the parameters
    const encodedParams = new URLSearchParams(params).toString();

    // Set up headers
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': process.env.COOKIE,
      'User-Agent': process.env.USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Origin': 'https://pieraksts.mfa.gov.lv',
      'Referer': 'https://pieraksts.mfa.gov.lv/en/india/index',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-User': '?1',
      'Te': 'trailers'
    };

    // Send the POST request
    const response = await axios.get('https://pieraksts.mfa.gov.lv/en/india/index', encodedParams, {
      headers,
      maxRedirects: 0, // Prevent Axios from following redirects
      validateStatus: status => status === 302 || status === 200, // Accept 302 or 200 as valid responses
    });

    // Handle the response
    if (response.status === 302) {
      console.log(`Response Status: ${response.status}`);
      console.log(`Response Header: ${response.headers}\n`);
      console.log(`Response Data: ${response.data}`);
      console.log('Redirect found:', response.headers.location);

      // 
    } else if (response.status === 200) {
      console.log('Response status: 200');
      console.log('Response data:', response.headers);
    } else {
      console.log('Unexpected response status:', response.status);
    }
  } catch (error) {
    console.error('Error submitting form:', error.response ? error.response.data : error.message);
  }
})();
