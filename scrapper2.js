require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio"); // Import cheerio for HTML parsing
const fs = require("fs"); // Import fs for file system operations

const api_key = "CAP-9AB442C63144F399A7CD72BB26B2ED03";
const site_url = "https://pieraksts.mfa.gov.lv/en/india";
const site_key = "6LcNh8QUAAAAABr3tVBk1tkgg8xlr1DDmmYtGwCA";
let csrfToken = "";
let captcha_token = "";
let mfaSchedulerSession;
let cookies =
  "_csrf-mfa-scheduler=3ad1d0ca2c02b4d471b3c986b2c5ada45ba1269b2e6af80d702892684a9d9401a%3A2%3A%7Bi%3A0%3Bs%3A19%3A%22_csrf-mfa-scheduler%22%3Bi%3A1%3Bs%3A32%3A%22iN6kzqzkr_LlxBNs2D2oDAlxOXCtRSJC%22%3B%7D; mfaSchedulerSession=" +
  mfaSchedulerSession;
let serviceIds = "";
let available_time = "";
let available_date = "";
// Header
const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
  Cookie: cookies,
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate, br",
  Origin: "https://pieraksts.mfa.gov.lv",
  Referer: "https://pieraksts.mfa.gov.lv/en/india/index",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-User": "?1",
  Te: "trailers",
};

async function capsolver() {
  const payload = {
    clientKey: api_key,
    task: {
      type: "ReCaptchaV3TaskProxyLess",
      websiteKey: site_key,
      websiteURL: site_url,
    },
  };

  try {
    const res = await axios.post(
      "https://api.capsolver.com/createTask",
      payload
    );
    const task_id = res.data.taskId;
    if (!task_id) {
      console.log("Failed to create task:", res.data);
      return;
    }
    console.log("Got taskId:", task_id);

    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for 1 second

      const getResultPayload = { clientKey: api_key, taskId: task_id };
      const resp = await axios.post(
        "https://api.capsolver.com/getTaskResult",
        getResultPayload
      );
      const status = resp.data.status;

      if (status === "ready") {
        return resp.data.solution.gRecaptchaResponse;
      }
      if (status === "failed" || resp.data.errorId) {
        console.log("Solve failed! response:", resp.data);
        return;
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

capsolver().then((token) => {
  captcha_token;
});

//console.log("CAPTCHA: ", captcha_token);

async function setCookie(cookieData) {
  // Set cookies
  if (cookieData) {
    let setCookie = cookieData;
    let cookieString = setCookie[0];
    let cookieMatch = cookieString.match(/mfaSchedulerSession=([^;]+)/);

    if (cookieMatch) {
      mfaSchedulerSession = cookieMatch[1];
      console.log(mfaSchedulerSession, cookies);
      cookies = `_csrf-mfa-scheduler=3ad1d0ca2c02b4d471b3c986b2c5ada45ba1269b2e6af80d702892684a9d9401a%3A2%3A%7Bi%3A0%3Bs%3A19%3A%22_csrf-mfa-scheduler%22%3Bi%3A1%3Bs%3A32%3A%22iN6kzqzkr_LlxBNs2D2oDAlxOXCtRSJC%22%3B%7D; mfaSchedulerSession=${mfaSchedulerSession}`;
      console.log("COOKIEs: ", cookies);
    }
  }
}

/**********************************************************  STEP ONE REQUEST  *******************************/
async function stepOneRequest() {
  try {
    const response = await axios.get(
      "https://pieraksts.mfa.gov.lv/en/india/index",
      {
        headers,
        maxRedirects: 0, // Prevent Axios from following redirects
        validateStatus: (status) => status === 302 || status === 200, // Accept 302 or 200 as valid responses
      }
    );

    if (response.status === 302) {
      console.log(`Response Status: ${response.status}`);
      console.log(`Response Header: ${response.headers}\n`);
      console.log(`Response Data: ${response.data}`);
      console.log("Redirect found:", response.headers.location);
    } else if (response.status === 200) {
      console.log("Response status: 200");
      console.log("Response data:", response.headers);

      const $ = cheerio.load(response.data);
      let csrfToken_loader = $('input[name="_csrf-mfa-scheduler"]');
      console.log("CSRF TOKEN:", csrfToken_loader.attr("value"));
      csrfToken = csrfToken_loader.attr("value");

      fs.writeFileSync("index.html", response.data);
    } else {
      console.log("Unexpected response status:", response.status);
    }
  } catch (error) {
    console.error(
      "Error submitting form:",
      error.response ? error.response.data : error.message
    );
  }
}

/************************************************ STEP TWO REQUEST ******************************** */
async function stepTwoRequest() {
  try {
    const params = {
      branch_office_id: "15",
      "_csrf-mfa-scheduler": csrfToken,
      "Persons[0][first_name]": "david",
      "Persons[0][last_name]": "daaa",
      e_mail: "next@gmail.com",
      e_mail_repeat: "next@gmail.com",
      phone: "+2349035545454",
    };

    const encodedParams = new URLSearchParams(params).toString();

    const response = await axios.post(
      "https://pieraksts.mfa.gov.lv/en/india/index",
      encodedParams,
      {
        headers,
        maxRedirects: 0,
        validateStatus: (status) => status === 302 || status === 200,
      }
    );

    if (response.status === 302) {
      console.log(`Response Status: ${response.status}`);
      console.log(`Response Header: ${response.headers}\n`);
      console.log(`Response Data: ${response.data}`);
      console.log("Redirect found:", response.headers.location);
    } else if (response.status === 200) {
      console.log("Response status: 200");
      console.log("Response data:", response.headers);
    } else {
      console.log("Unexpected response status:", response.status);
    }
  } catch (error) {
    console.error(
      "Error submitting form:",
      error.response ? error.response.data : error.message
    );
  }
}

/**********************************************************  STEP THREE REQUEST  *******************************/
async function stepThreeRequest() {
  try {
    const response = await axios.get(
      "https://pieraksts.mfa.gov.lv/en/india/step2",
      {
        headers,
        maxRedirects: 0, // Prevent Axios from following redirects
        validateStatus: (status) => status === 302 || status === 200, // Accept 302 or 200 as valid responses
      }
    );

    if (response.status === 302) {
      console.log(`Response Status: ${response.status}`);
      console.log(`Response Header: ${response.headers}\n`);
      console.log(`Response Data: ${response.data}`);
      console.log("Redirect found:", response.headers.location);
    } else if (response.status === 200) {
      console.log("Response status: 200");
      console.log("Response data:", response.headers);

      const $ = cheerio.load(response.data);
      let csrfToken_loader = $('input[name="_csrf-mfa-scheduler"]');
      console.log("CSRF TOKEN:", csrfToken_loader.attr("value"));
      csrfToken = csrfToken_loader.attr("value");

      fs.writeFileSync("step2.html", response.data);
    } else {
      console.log("Unexpected response status:", response.status);
    }
  } catch (error) {
    console.error(
      "Error submitting form:",
      error.response ? error.response.data : error.message
    );
  }
}

/************************************************ STEP FOUR REQUEST ******************************** */
async function stepFourRequest() {
  try {
    console.log("CSRF token: ", csrfToken);
    const params = {
      "_csrf-mfa-scheduler": csrfToken,
      "Persons[0][service_ids][]": "619",
    };

    const encodedParams = new URLSearchParams(params).toString();

    const response = await axios.post(
      "https://pieraksts.mfa.gov.lv/en/india/step2",
      encodedParams,
      {
        headers,
        maxRedirects: 0,
        validateStatus: (status) => status === 302 || status === 200,
      }
    );

    if (response.status === 302) {
      console.log(`Response Status: ${response.status}`);
      console.log(`Response Header: ${response.headers}\n`);
      console.log(`Response Data: ${response.data}`);
      console.log("Redirect found:", response.headers.location);
    } else if (response.status === 200) {
      console.log("Response status: 200");
      console.log("Response data:", response.data);
    } else {
      console.log("Unexpected response status:", response.status);
    }
  } catch (error) {
    console.error(
      "Error submitting form:",
      error.response ? error.response.data : error.message
    );
  }
}

/**********************************************************  STEP FIVE REQUEST  *******************************/
async function stepFiveRequest() {
  try {
    const response1 = await axios.get(
      "https://pieraksts.mfa.gov.lv/en/calendar/available-month-dates?year=2024&month=8",
      {
        headers,
        maxRedirects: 0, // Prevent Axios from following redirects
        validateStatus: (status) => status === 302 || status === 200, // Accept 302 or 200 as valid responses
      }
    );

    const response2 = await axios.get(
      "https://pieraksts.mfa.gov.lv/en/calendar/available-time-slots?date=2024-8-23",
      {
        headers,
        maxRedirects: 0, // Prevent Axios from following redirects
        validateStatus: (status) => status === 302 || status === 200, // Accept 302 or 200 as valid responses
      }
    );

    const response3 = await axios.get(
      "https://pieraksts.mfa.gov.lv/en/calendar/last-available-date",
      {
        headers,
        maxRedirects: 0, // Prevent Axios from following redirects
        validateStatus: (status) => status === 302 || status === 200, // Accept 302 or 200 as valid responses
      }
    );

    if (
      response1.status === 302 &&
      response2.status === 302 &&
      response3.status === 302
    ) {
      console.log(`Available date: ${response1.data}`);
      console.log(`Available time slot: ${response2.data}\n`);
      console.log(`Last available date: ${response3.data}`);
    } else if (
      response1.status === 200 &&
      response2.status === 200 &&
      response3.status === 200
    ) {
      console.log(`Available date: ${response1.data}`);
      console.log("Available time slot:", response2.data);
      console.log(`Last available date: ${response3.data}`);

      available_date = response1.data;
      const firstSlot = response2.data[0];
      available_time = firstSlot.times;
      serviceIds = firstSlot.service_ids;

      console.log(
        "DATA: ",
        JSON.stringify(available_date),
        String(available_time),
        JSON.stringify(serviceIds)
      );
    } else {
      console.log("Unexpected response status:", response1.status);
      console.log("Unexpected response status:", response2.status);
      console.log("Unexpected response status:", response3.status);
    }
  } catch (error) {
    console.error(
      "Error submitting form:",
      error.response ? error.response.data : error.message
    );
  }
}

/**********************************************************  STEP SIX REQUEST  *******************************/
async function stepSixRequest() {
  try {
    const response = await axios.get(
      "https://pieraksts.mfa.gov.lv/en/india/step3",
      {
        headers,
        maxRedirects: 0, // Prevent Axios from following redirects
        validateStatus: (status) => status === 302 || status === 200, // Accept 302 or 200 as valid responses
      }
    );

    if (response.status === 302) {
      console.log(`Response Status: ${response.status}`);
      console.log(`Response Header: ${response.headers}\n`);
      console.log(`Response Data: ${response.data}`);
      console.log("Redirect found:", response.headers.location);
    } else if (response.status === 200) {
      console.log("Response status: 200");
      console.log("Response data:", response.headers);

      const $ = cheerio.load(response.data);
      let csrfToken_loader = $('input[name="_csrf-mfa-scheduler"]');
      console.log("CSRF TOKEN:", csrfToken_loader.attr("value"));
      csrfToken = csrfToken_loader.attr("value");

      fs.writeFileSync("step3.html", response.data);
    } else {
      console.log("Unexpected response status:", response.status);
    }
  } catch (error) {
    console.error(
      "Error submitting form:",
      error.response ? error.response.data : error.message
    );
  }
}

/************************************************ STEP SEVEN REQUEST ******************************** */
async function stepSevenRequest() {
  try {
    console.log("Time: ", available_time);
    const params = {
      "_csrf-mfa-scheduler": csrfToken,
      "ServiceGroups[0][visit_date]": available_date[0],
      "ServiceGroups[0][service_ids][0]": serviceIds[0].id,
      "ServiceGroups[0][visit_time]": String(available_time),
    };

    const encodedParams = new URLSearchParams(params).toString();

    const response = await axios.post(
      "https://pieraksts.mfa.gov.lv/en/india/step3",
      encodedParams,
      {
        headers,
        maxRedirects: 0,
        validateStatus: (status) => status === 302 || status === 200,
      }
    );

    if (response.status === 302) {
      console.log(`Response Status: ${response.status}`);
      console.log(`Response Header: ${response.headers}\n`);
      console.log(`Response Data: ${response.data}`);
      console.log("Redirect found:", response.headers.location);
    } else if (response.status === 200) {
      console.log("Response status: 200");
      console.log("Response data:", response.headers);
    } else {
      console.log("Unexpected response status:", response.status);
    }
  } catch (error) {
    console.error(
      "Error submitting form:",
      error.response ? error.response.data : error.message
    );
  }
}

/**********************************************************  STEP EIGHT REQUEST  *******************************/
async function stepEightRequest() {
  try {
    const response = await axios.get(
      "https://pieraksts.mfa.gov.lv/en/india/step4",
      {
        headers,
        maxRedirects: 0, // Prevent Axios from following redirects
        validateStatus: (status) => status === 302 || status === 200, // Accept 302 or 200 as valid responses
      }
    );

    if (response.status === 302) {
      console.log(`Response Status: ${response.status}`);
      console.log(`Response Header: ${response.headers}\n`);
      console.log(`Response Data: ${response.data}`);
      console.log("Redirect found:", response.headers.location);
    } else if (response.status === 200) {
      console.log("Response status: 200");
      console.log("Response data:", response.headers);

      const $ = cheerio.load(response.data);
      let csrfToken_loader = $('input[name="_csrf-mfa-scheduler"]');
      console.log("CSRF TOKEN:", csrfToken_loader.attr("value"));
      csrfToken = csrfToken_loader.attr("value");

      fs.writeFileSync("step4.html", response.data);
    } else {
      console.log("Unexpected response status:", response.status);
    }
  } catch (error) {
    console.error(
      "Error submitting form:",
      error.response ? error.response.data : error.message
    );
  }
}

/************************************************ STEP NINE REQUEST ******************************** */
async function stepNineRequest() {
  try {
    console.log("Time: ", available_time);
    const params = {
      "_csrf-mfa-scheduler": csrfToken,
    };

    const encodedParams = new URLSearchParams(params).toString();

    const response = await axios.post(
      "https://pieraksts.mfa.gov.lv/en/india/step4",
      encodedParams,
      {
        headers,
        maxRedirects: 0,
        validateStatus: (status) => status === 302 || status === 200,
      }
    );

    if (response.status === 302) {
      console.log(`Response Status: ${response.status}`);
      console.log(`Response Header: ${response.headers}\n`);
      console.log(`Response Data: ${response.data}`);
      console.log("Redirect found:", response.headers.location);
    } else if (response.status === 200) {
      console.log("Response status: 200");
      console.log("Response data:", response.headers);
    } else {
      console.log("Unexpected response status:", response.status);
    }
  } catch (error) {
    console.error(
      "Error submitting form:",
      error.response ? error.response.data : error.message
    );
  }
}

/************************************************** MAIN FUNCTION *********************************************/
async function main() {
  console.log(
    "\n/************************* FIRST REQUEST **************************************\n"
  );
  await stepOneRequest();
  console.log(
    "\n/************************* SECOND REQUEST **************************************\n"
  );
  await stepTwoRequest();
  console.log(
    "\n/************************* THIRD REQUEST **************************************\n"
  );
  await stepThreeRequest();
  console.log(
    "\n/************************* FOURTH REQUEST **************************************\n"
  );
  await stepFourRequest();
  console.log(
    "\n/************************* FIFTH REQUEST **************************************\n"
  );
  await stepFiveRequest();
  console.log(
    "\n/************************* SIX REQUEST **************************************\n"
  );
  await stepSixRequest();
  console.log(
    "\n/************************* SEVENTH REQUEST **************************************\n"
  );
  await stepSevenRequest();
  console.log(
    "\n/************************* EIGHT REQUEST **************************************\n"
  );
  await stepEightRequest();
  console.log(
    "\n/************************* NINE REQUEST**************************************\n"
  );
  await stepNineRequest();
}

main();
