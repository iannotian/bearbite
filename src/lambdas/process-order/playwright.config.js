// @ts-check

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  reportSlowTests: {
    max: 0,
    threshold: 25000,
  },
  use: {
    browserName: "chromium",
  },
};

module.exports = config;
