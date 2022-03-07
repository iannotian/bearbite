const {
  validateSecrets,
} = require("../../src/lambdas/process-order/purchaser.js");
const fs = require("fs");
require("dotenv").config();

const secrets = validateSecrets(process.env);

const secretEventTemplate = JSON.parse(
  fs.readFileSync("events/process-order/event.secret.template.json").toString()
);

const secretEvent = {
  ...secretEventTemplate,
  body: JSON.stringify({ ...secrets }),
};

fs.writeFileSync(
  "events/process-order/event.secret.json",
  JSON.stringify(secretEvent)
);
