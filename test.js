const axios = require('axios');

// Shared headers template
const baseHeaders = {
    'Host': 'pieraksts.mfa.gov.lv',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive'
};

// Function to create request config
function createRequestConfig(method, url, cookie, data = null, referer = null) {
    const headers = {
        ...baseHeaders,
        'Cookie': cookie,
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

// Example usage of createRequestConfig

// Dynamic values for cookies and data
const cookie = '_csrf-mfa-scheduler=74d00813af4c26ca6babe8b0da7354b2755e5e8d2c0b0e7b0061fb7db2af62b1a%3A2%3A%7Bi%3A0%3Bs%3A19%3A%22_csrf-mfa-scheduler%22%3Bi%3A1%3Bs%3A32%3A%225_tMlSVA1Oxm0xyTpj4UYBBN2dbtfw2o%22%3B%7D; mfaSchedulerSession=jp0kvteo3uhvld9edir5up5e5k';
const step1Data = 'branch_office_id=4&_csrf-mfa-scheduler=6xSqfd1x6qrReXjmDNV9lbauUotBUCaxQuV3OkFumN_eS94wsSK86-A2AIs8rQTBxsRm3hgSZP9wgRVOJxmqsA%3D%3D&Persons%5B0%5D%5Bfirst_name%5D=ucheechi&Persons%5B0%5D%5Blast_name%5D=daviid&e_mail=uchedavid%40gmail.com&e_mail_repeat=uchedavid%40gmail.com&phone=%2B234566777777';
const step2Data = '_csrf-mfa-scheduler=3Xe4qu9eM_pvHWsJYFcbnMGLAtjH2GoGMR4cKBP8ssboKMzngw1lu15SE2RQL2LIseE2jZ6aKEgDen5cdYuAqQ%3D%3D&Persons%5B0%5D%5Bservice_ids%5D%5B%5D=253';

// Step 1 request
const step1Config = createRequestConfig('post', 'https://pieraksts.mfa.gov.lv/en/uited-arab-emirates/index', cookie, step1Data, 'https://pieraksts.mfa.gov.lv/en/uited-arab-emirates/index');

// Step 2 request
const step2Config = createRequestConfig('post', 'https://pieraksts.mfa.gov.lv/en/uited-arab-emirates/step2', cookie, step2Data, 'https://pieraksts.mfa.gov.lv/en/uited-arab-emirates/step2');

// Step 3 - First GET request
const availableDatesConfig = createRequestConfig('get', 'https://pieraksts.mfa.gov.lv/en/calendar/available-month-dates?year=2024&month=8', cookie, null, 'https://pieraksts.mfa.gov.lv/en/uited-arab-emirates/step3');

// Step 3 - Second GET request
const lastAvailableDateConfig = createRequestConfig('get', 'https://pieraksts.mfa.gov.lv/en/calendar/last-available-date', cookie, null, 'https://pieraksts.mfa.gov.lv/en/uited-arab-emirates/step3');

// Send step 1 request
axios(step1Config)
    .then(response => {
        console.log('Step 1 succeeded with response:', response.headers);

        // Send step 2 request
        return axios(step2Config);
    })
    .then(response => {
        console.log('Step 2 succeeded with response:', response.headers);

        // Send first GET request in Step 3
        return axios(availableDatesConfig);
    })
    .then(response => {
        console.log('Available dates:', response.data);

        // Send second GET request in Step 3
        return axios(lastAvailableDateConfig);
    })
    .then(response => {
        console.log('Last available date:', response.data);
    })
    .catch(error => {
        console.error('Request failed', error);
    });
