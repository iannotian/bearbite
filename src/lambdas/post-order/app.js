exports.lambdaHandler = async (event, context) => {
  try {
    // @todo Check if order was placed for user in DynamoDB
    // @todo Inform user if order pending, completed or errored for the day. Guard return order ID.
    // @todo Place order request on queue for process-order Lambda.
    // @todo Return order ID.

    console.info("Someday this will post an order!");
  } catch (error) {
    console.error("Error!");
    throw error;
  }
};
