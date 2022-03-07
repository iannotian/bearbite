const { test } = require("@playwright/test");
const {
  purchaseAmazingGiftCardWithBearbiteFunds,
  validateSecrets,
} = require("../purchaser.js");
require("dotenv").config();

test("Purchase Amazing gift card with Bearbite funds", async ({ page }) => {
  const secrets = validateSecrets(process.env);

  await purchaseAmazingGiftCardWithBearbiteFunds(page, secrets);
});
