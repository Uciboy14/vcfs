// bot.js

require('dotenv').config(); // Load environment variables from .env file
const axios = require('axios'); // Import axios for HTTP requests
const cheerio = require('cheerio'); // Import cheerio for HTML parsing
const fs = require('fs'); // Import fs for file system operations

// Import constants from constant.js
const {
  api_key,
  stepOneUrl,
  stepTwoUrl,
  stepThreeUrl,
  stepFourUrl,
  available_month_date_url,
  last_available_date_url,
  COOKIE,
  USER_AGENT
} = require('./constants.js');


// Headers
const headers = {
    'Host': 'pieraksts.mfa.gov.lv',
    'Cookie': COOKIE,
    'User-Agent': USER_AGENT,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Origin': 'https://pieraksts.mfa.gov.lv',
    'Referer': stepOneUrl,
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-User': '?1',
    'Te': 'trailers',
    'Connection': 'keep-alive'
  };

  // make request function
  async function makeRequest(url) {
    try {
        const response = await axios.get(url, headers);

        console.log("Checking:", response.headers)

        // Load HTML into cheerio
        const $ = cheerio.load(response.data)

        // Retrieve a hidden CSRF token from the HTML
        const csrfToken = $('input[name="_csrf-mfa-scheduler"]')
        console.log(csrfToken.attr('value'));

        // Save HTML to a file
        fs.writeFileSync('index.html', response.data);
    } catch(error) {
        console.error('Error fetching or parsing HTML:', error.message);
    }
  }

  // Call the function with a sample URL
  makeRequest(stepOneUrl);