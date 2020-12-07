// Add your resolvers here

module.exports = {
  ...require("./Query"),
  ...require("./Mutation"),
  ...require("./Subscription")
};
