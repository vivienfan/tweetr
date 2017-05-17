"use strict";

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to db
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet);
      callback(null, true);
    },

    // Get all tweets in db, sorted by newest first
    getTweets: function(callback) {
      db.collection("tweets").find().toArray((err, array) => {
        if (err) {
          callback(err, null);
          return;
        }
        const sortNewestFirst = (a, b) => a.created_at - b.created_at;
        callback(null, array.sort(sortNewestFirst));
      });
    }

  };
}
