const { shield, or } = require("graphql-shield");
const rules = require("./rules");

// define your permissions here
const permissions = shield({});

module.exports = permissions;
