const { authenticator } = require("otplib");

function validateSecrets({
  AMAZING_BASE_URL,
  AMAZING_LOGIN_EMAIL,
  AMAZING_LOGIN_PASSWORD,
  AMAZING_OTP_SECRET,
  BEARBITE_CARD_NUMBER_LAST_4,
  BEARBITE_EXPIRATION_MM_SLASH_YYYY,
  BEARBITE_NAME_ON_CARD,
  ENABLE_PURCHASE,
}) {
  if (
    !(
      typeof AMAZING_BASE_URL === "string" &&
      typeof AMAZING_LOGIN_EMAIL === "string" &&
      typeof AMAZING_LOGIN_PASSWORD === "string" &&
      typeof AMAZING_OTP_SECRET === "string" &&
      typeof BEARBITE_CARD_NUMBER_LAST_4 === "string" &&
      typeof BEARBITE_EXPIRATION_MM_SLASH_YYYY === "string" &&
      typeof BEARBITE_NAME_ON_CARD === "string" &&
      typeof ENABLE_PURCHASE === "string"
    )
  ) {
    console.error(
      JSON.stringify({
        AMAZING_BASE_URL,
        AMAZING_LOGIN_EMAIL: typeof AMAZING_LOGIN_EMAIL,
        AMAZING_LOGIN_PASSWORD: typeof AMAZING_LOGIN_PASSWORD,
        AMAZING_OTP_SECRET: typeof AMAZING_OTP_SECRET,
        BEARBITE_CARD_NUMBER_LAST_4: typeof BEARBITE_CARD_NUMBER_LAST_4,
        BEARBITE_EXPIRATION_MM_SLASH_YYYY:
          typeof BEARBITE_EXPIRATION_MM_SLASH_YYYY,
        BEARBITE_NAME_ON_CARD: typeof BEARBITE_NAME_ON_CARD,
        ENABLE_PURCHASE: typeof ENABLE_PURCHASE,
      })
    );

    throw new Error("Environment variables not valid. Fatal error.");
  }

  return {
    AMAZING_BASE_URL,
    AMAZING_LOGIN_EMAIL,
    AMAZING_LOGIN_PASSWORD,
    AMAZING_OTP_SECRET,
    BEARBITE_CARD_NUMBER_LAST_4,
    BEARBITE_EXPIRATION_MM_SLASH_YYYY,
    BEARBITE_NAME_ON_CARD,
    ENABLE_PURCHASE,
  };
}

async function signInToAmazing(page, { baseUrl, email, password, otpSecret }) {
  await page.goto(baseUrl);

  await page.hover("text=Hello, Sign in Account & Lists");

  if (page.locator("#nav-flyout-ya-signin >> text=Sign in")) {
    await loginWithEmailAndPassword(page, { email, password });

    if (page.locator("text=Don't require OTP on this browser")) {
      await enterOtp(page, { otpSecret });
    }
  }
}

async function enterOtp(page, { otpSecret }) {
  // await page.click("text=Don't require OTP on this browser", { timeout: 5000 });

  const token = authenticator.generate(otpSecret);

  await page.locator('input[name="otpCode"]').fill(token);
  await page.locator('input[name="mfaSubmit"]').click();
}

async function loginWithEmailAndPassword(page, { email, password }) {
  await page.hover("#nav-flyout-ya-signin >> text=Sign in");

  await page.locator("#nav-flyout-ya-signin >> text=Sign in").click();

  await page.fill('input[name="email"]', email);

  await page.locator('input[type="submit"]').click();

  await page.fill('input[name="password"]', password);

  await page.locator('input[type="submit"]').click();
}

async function goToGiftCardProductPage(page, { baseUrl }) {
  await page.goto(baseUrl + "/gp/product/B086KKT3RX?");
  await page.waitForSelector("#productTitle >> text=Reload", {
    timeout: 5000,
  });
}

async function startGiftCardPurchaseAndStartCheckout(
  page,
  amountInDollars = 15
) {
  if (amountInDollars < 10) {
    throw new Error("Amazing error: Amount cannot be lower than $10.");
  }

  if (amountInDollars > 15) {
    throw new Error("Bearbite error: Amount cannot be above $15.");
  }

  await page.locator('[placeholder="Other"]').fill(`${amountInDollars}`);

  await page.click('text=$ Buy Now >> input[type="submit"]');
}

async function selectBearbiteCardPaymentOption(
  page,
  { cardLast4, cardExpiration, cardNameOnCard }
) {
  await page.click('[aria-label="Payment method"] >> text=Payment method', {
    timeout: 5000,
  });

  await page.waitForLoadState("networkidle");

  await page.click(
    `text=Visa ending in ${cardLast4}Visaending in ${cardLast4}${cardNameOnCard}${cardExpiration}`
  );

  await page.click("#orderSummaryPrimaryActionBtn");

  await page.waitForSelector(`text=Payment method Visa ending in ${cardLast4}`);
  await page.waitForSelector("#submitOrderButtonId");
}

async function completeCheckout(page) {
  await page.locator("#submitOrderButtonId").click();
  await page.pause();
}

async function purchaseAmazingGiftCardWithBearbiteFunds(page, secrets) {
  const {
    AMAZING_BASE_URL: baseUrl,
    AMAZING_LOGIN_EMAIL: email,
    AMAZING_LOGIN_PASSWORD: password,
    AMAZING_OTP_SECRET: otpSecret,
    BEARBITE_CARD_NUMBER_LAST_4: cardLast4,
    BEARBITE_EXPIRATION_MM_SLASH_YYYY: cardExpiration,
    BEARBITE_NAME_ON_CARD: cardNameOnCard,
    ENABLE_PURCHASE: shouldCompletePurchase,
  } = secrets;

  await signInToAmazing(page, { baseUrl, email, password, otpSecret });
  await goToGiftCardProductPage(page, { baseUrl });
  await startGiftCardPurchaseAndStartCheckout(page);
  await selectBearbiteCardPaymentOption(page, {
    cardLast4,
    cardExpiration,
    cardNameOnCard,
  });

  if (shouldCompletePurchase === "true") {
    await completeCheckout(page);
    console.info(
      "Checkout completed. Purchased Amazing gift card with Bearbite."
    );
  } else {
    console.info("ENABLE_PURCHASE is not set to 'true'; no purchase was made.");
  }

  return {
    success: true,
  };
}

exports.purchaseAmazingGiftCardWithBearbiteFunds =
  purchaseAmazingGiftCardWithBearbiteFunds;

exports.validateSecrets = validateSecrets;
