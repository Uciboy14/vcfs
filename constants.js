// constant.js

const api_key = "CAP-9AB442C63144F399A7CD72BB26B2ED03";
const stepOneUrl = "https://pieraksts.mfa.gov.lv/en/india/index";
const stepTwoUrl = "https://pieraksts.mfa.gov.lv/en/india/step2";
const stepThreeUrl = "https://pieraksts.mfa.gov.lv/en/india/step3";
const stepFourUrl = "https://pieraksts.mfa.gov.lv/en/india/step4";
const available_month_date_url = `https://pieraksts.mfa.gov.lv/en/calendar/available-month-dates?year=2024&month=8`;
const last_available_date_url = `https://pieraksts.mfa.gov.lv/en/calendar/last-available-date`;
const COOKIE = '_csrf-mfa-scheduler=74d00813af4c26ca6babe8b0da7354b2755e5e8d2c0b0e7b0061fb7db2af62b1a%3A2%3A%7Bi%3A0%3Bs%3A19%3A%22_csrf-mfa-scheduler%22%3Bi%3A1%3Bs%3A32%3A%225_tMlSVA1Oxm0xyTpj4UYBBN2dbtfw2o%22%3B%7D; mfaSchedulerSession=nomtdbopdg6g4i2i5qv1sr1tjh';
const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0';

module.exports = {
  api_key,
  stepOneUrl,
  stepTwoUrl,
  stepThreeUrl,
  stepFourUrl,
  available_month_date_url,
  last_available_date_url,
  COOKIE,
  USER_AGENT
};
