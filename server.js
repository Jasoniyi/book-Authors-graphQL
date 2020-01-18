const express = require("express");
const expressGraphQl = require("express-graphql");
const schema = require("./schema");
// const connectDb = require("./DB/connection");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.DATABASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  console.log("db connected ..!")
);
const app = express();

app.use(
  "/graphql",
  expressGraphQl({
    schema,
    graphiql: true
  })
);

// connectDb();
const Port = process.env.Port || 5000;
app.listen(Port, () => console.log(`app running on ${Port}`));
