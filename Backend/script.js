const { GraphQLServer, PubSub } = require("graphql-yoga");
const { makeSchema } = require("@nexus/schema");
const { nexusPrisma } = require("nexus-plugin-prisma");
const { PrismaClient } = require("@prisma/client");
const types = require("./src/types");
const cookieParser = require("cookie-parser");
const Vonage = require("@vonage/server-sdk");
const bodyParser = require("body-parser");
const permissions = require("./src/permissions");

const prisma = new PrismaClient();

const pubSub = new PubSub();

// uncomment if you have these vonage env variables set else
// remove if you're not making use of the Vonage SMS API.
// Also remove the package in your package.json file

// const vonage = new Vonage({
//   apiKey: process.env.VONAGE_API_KEY,
//   apiSecret: process.env.VONAGE_API_SECRET,
//   applicationId: process.env.VONAGE_APPLICATION_ID,
//   privateKey: process.env.VONAGE_APPLICATION_PRIVATE_KEY_PATH,
//   signatureSecret: process.env.VONAGE_SIGNATURE_SECRET,
//   signatureMethod: process.env.VONAGE_SIGNATURE_METHOD,
// });

const options = {
  port: process.env.PORT || 4000,
  endpoint: "/api",
  subscriptions: "/subscriptions",
  playground: "/playground",
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_ORIGIN,
  },
};

const server = new GraphQLServer({
  schema: makeSchema({
    types,
    plugins: [nexusPrisma({ experimentalCRUD: true })],
    outputs: {
      schema: __dirname + "/src/schema.graphql",
      typegen: __dirname + "/src/generated/nexus.ts",
    },
  }),
  // uncomment this file when you have permissions set up already

  // middlewares: [permissions],
  context: async (sConfig) => {
    const data = {
      sConfig,
      prisma,
      vonage,
      pubSub,
    };

    //   uncomment it if you have a helper method to extract the
    //   user id from the token in the http header else remove it
    //   you must have a getUserId method imported before using this.

    // const userId = await getUserId(sConfig);
    // const user = await prisma.user.findOne({ where: { id: Number(userId) } });
    // if (user) {
    //   data.user = user;
    // }
    return data;
  },
});

// uncomment it if you use cookie and body perser features of express js.

// server.express.use(cookieParser());
// server.express.use(bodyParser.urlencoded({ extended: true }));
// server.express.use(bodyParser.json());

server.start(options, ({ port, playground }) => {
  console.log(`🚀 Server ready at: http://localhost:${port}${playground}\n⭐️`);
});
