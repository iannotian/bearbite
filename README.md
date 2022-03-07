`cp .example.env .env`
Enter data into `.env`
Set `ENABLE_PURCHASE` to `true` if you want the test to be able to complete a purchase.

`node scripts/process-order/create-process-order-secret-event-for-testing.js`

`cd src/lambdas/process-order`
`npm i`
`npm run test:headed`
