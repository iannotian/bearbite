const playwright = require("playwright-aws-lambda");
const {
  purchaseAmazingGiftCardWithBearbiteFunds,
  validateSecrets,
} = require("./purchaser");

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

exports.lambdaHandler = async (event, context) => {
  let browser = null;
  let body;

  try {
    if (typeof event.body === "string") {
      body = JSON.parse(event.body);
    } else if (typeof event.body === "object") {
      body = event.body;
    }

    const secrets = validateSecrets(body);

    browser = await playwright.launchChromium();
    const context = await browser.newContext();

    const page = await context.newPage();

    const { success } = await purchaseAmazingGiftCardWithBearbiteFunds(
      page,
      secrets
    );

    success && console.info("Successful lambda!");
  } catch (error) {
    console.error("Error!");
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
