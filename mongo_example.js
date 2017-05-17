"use strict";

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://localhost:27017/tweeter";

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }

  // We have a connection to the "tweeter" db, starting here.
  console.log(`Connected to mongodb: ${MONGODB_URI}`);

  /* Method 1 */
/*  db.collection("tweets").find({}, (err, results) => {
    if (err) throw err;
    results.each((err, item) => console.log("  ", item));
    db.close();
  });*/

  /* Method 2 */
/*  db.collection("tweets").find({}, (err, results) => {
    if (err) throw err;
    results.toArray((err, resultsArray) => {
      if (err) throw err;
      console.log("results.toArray:", resultsArray);
    });
    db.close();
  });*/

  /* Method 2 Simplified */
/*  db.collection("tweets").find().toArray((err, results) => {
    if (err) throw err;
    console.log("results array: ", results);
    db.close();
  });*/

  function getTweets(callback) {
    db.collection("tweets").find().toArray(callback);
  }

  // ==> Later it can be invoked. Remember even if you pass
  //     `getTweets` to another scope, it still has closure over
  //     `db`, so it will still work. Yay!

  getTweets((err, tweets) => {
    if (err) throw err;
    console.log("Logging each tweet:");
    for (let tweet of tweets) {
      console.log(tweet);
    }
    db.close();
  });

});