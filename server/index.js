"use strict";

require("dotenv").config();

const PORT            = 8080;
const express         = require("express");
const bodyParser      = require("body-parser");
const cookieSession   = require('cookie-session');
const morgan          = require('morgan')
const sassMiddleware  = require('node-sass-middleware')

const app             = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: "session",
  keys: ["This-is-my-secrete-key"],
  maxAge: 20 * 365 * 24 * 60 * 60 * 1000 // 20 years
}));
app.use(sassMiddleware({
    src: "./server",
    dest: "./public",
}));
app.use(express.static("public"));
app.use(morgan('dev'));

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }
  console.log(`Connected to mongodb: ${MONGODB_URI}`);

  const DataHelpers = require("./lib/data-helpers.js")(db);
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);
  const homeRoutes = require("./routes/home")(DataHelpers);

  app.use("/tweets", tweetsRoutes);
  app.use("/", homeRoutes);
});

app.listen(PORT, () => {
  console.log("Tweetr listening on port " + PORT);
});