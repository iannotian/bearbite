This helps you automate purchases at Amazing with any sort of credit card. This credit card should be present on your account already.
If deployed as an AWS Lambda, you can trigger it via a request to the API Gateway (ideally protected with some secret) from your iOS Shortcuts app based on a time, so you can confirm before it completes a purchase.

In my testing, a purchase takes 30-40 seconds on Lambda.

`cp .example.env .env`
Enter data into `.env`
Set `ENABLE_PURCHASE` to `true` if you want the test to be able to complete a purchase.

`node scripts/process-order/create-process-order-secret-event-for-testing.js`

`cd src/lambdas/process-order`
`npm i`
`npm run test:headed`
