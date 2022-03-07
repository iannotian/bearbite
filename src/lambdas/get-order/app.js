exports.lambdaHandler = async (event, context) => {
  try {
    // @todo Check order status for ID (or API key) in DynamoDB and return it.

    console.info("Someday this will get an order!");
  } catch (error) {
    console.error("Error!");
    throw error;
  }
};
