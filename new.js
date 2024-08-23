const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Import constants
const {
  api_key,
  stepOneUrl,
  stepTwoUrl,
  stepThreeUrl,
  stepFourUrl,
  available_month_date_url,
  last_available_date_url,
  COOKIE,
  USER_AGENT,
} = require('./constants.js');

// Shared headers template
const baseHeaders = {
  'Host': 'pieraksts.mfa.gov.lv',
  'Cookie': COOKIE,
  'User-Agent': USER_AGENT,
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive'
};

// Function to create request config
function createRequestConfig(method, url, COOKIE, data = null, referer = null) {
  const headers = {
    ...baseHeaders,
    'Content-Type': method === 'post' ? 'application/x-www-form-urlencoded' : undefined,
    'Origin': referer ? new URL(referer).origin : undefined,
    'Referer': referer,
    'Upgrade-Insecure-Requests': method === 'post' ? '1' : undefined,
    'Sec-Fetch-Dest': method === 'post' ? 'document' : 'empty',
    'Sec-Fetch-Mode': method === 'post' ? 'navigate' : 'cors',
    'Sec-Fetch-Site': method === 'post' ? 'same-origin' : 'same-origin',
    'Sec-Fetch-User': method === 'post' ? '?1' : undefined,
    'X-Requested-With': method === 'get' ? 'XMLHttpRequest' : undefined,
    'Te': 'trailers'
  };

  return {
    method,
    url,
    headers,
    data
  };
}

// Define each step separately

// Step 1: Initial GET request
async function step1() {
  try {
    const step1Config = createRequestConfig('get', stepOneUrl, COOKIE);
    const response = await axios(step1Config);
    console.log('Step 1 succeeded with response:', response.status);

    // Parse response to get CSRF token
    const $ = cheerio.load(response.data);
    const csrfToken = $('input[name="_csrf-mfa-scheduler"]').attr('value');
    console.log("CSRF TOKEN:", csrfToken);

    // Prepare data for Step 2
    const params = {
      'branch_office_id': '15',
      '_csrf-mfa-scheduler': csrfToken,
      'Persons[0][first_name]': 'chancess',
      'Persons[0][last_name]': 'boilerss',
      'e_mail': 'chanceboilerr@gmail.com',
      'e_mail_repeat': 'chanceboilerr@gmail.com',
      'phone': '+234903378333'
    };
    const step1Data = new URLSearchParams(params).toString();
    return step1Data;

  } catch (error) {
    console.error('Step 1 failed', error);
    throw error;
  }
}

// Step 2: POST request using data from Step 1
async function step2(step1Data) {
  try {
    const step2Config = createRequestConfig('post', stepOneUrl, COOKIE, step1Data, stepOneUrl);
    const response = await axios(step2Config);
    console.log('Step 2 succeeded with response:', response.status);
  } catch (error) {
    console.error('Step 2 failed', error);
    throw error;
  }
}

// Step 3: GET request
async function step3() {
  try {
    const step3Config = createRequestConfig('get', stepTwoUrl, COOKIE);
    const response = await axios(step3Config);
    console.log('Step 3 succeeded with response:', response.status);
  } catch (error) {
    console.error('Step 3 failed', error);
    throw error;
  }
}

// Step 4: Another POST request with dynamic data
async function step4(step2Data) {
  try {
    const step4Config = createRequestConfig('post', stepTwoUrl, COOKIE, step2Data, stepTwoUrl);
    const response = await axios(step4Config);
    console.log('Step 4 succeeded with response:', response.status);
  } catch (error) {
    console.error('Step 4 failed', error);
    throw error;
  }
}

// Step 5: Final GET request
async function step5() {
  try {
    const step5Config = createRequestConfig('get', stepThreeUrl, COOKIE);
    const response = await axios(step5Config);
    console.log('Step 5 succeeded with response:', response.status);
  } catch (error) {
    console.error('Step 5 failed', error);
    throw error;
  }
}

// Execute steps in sequence
(async function executeSteps() {
  try {
    const step1Data = await step1();
    await step2(step1Data);
    await step3();
    await step4(step1Data);
    await step5();
  } catch (error) {
    console.error('An error occurred during the process:', error);
  }
})();
