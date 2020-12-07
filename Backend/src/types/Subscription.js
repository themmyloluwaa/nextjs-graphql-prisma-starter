const { subscriptionField } = require("@nexus/schema");

// default mutation type events to subscribe to.
const mutationType = ["CREATED", "UPDATED", "DELETED"];

// start defining your resolvers here
const Subscription = subscriptionField("", {});

module.exports = Subscription;
