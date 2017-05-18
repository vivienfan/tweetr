"use strict";

const ObjectId = require("mongodb").ObjectID;

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
    },

    // This function updates likes for tweet posts
    // input: tweet id
    // output: none
    updateLikes: function (tId, uId, callback) {
      db.collection("tweets").findOne({ _id: ObjectId(tId)}, function(err, result) {
        if (err) {
          callback(err, null);
        }
        db.collection("tweets").findOne({ _id: ObjectId(tId)}, function(err, result) {
          if (err) {
            callback(err, null);
          }
          let index = result.likes.indexOf(uId);
          let updated = [];
          if (index === -1) {
            result.likes.push(uId);
            callback(null, true);
          } else {
            result.likes.splice(index, 1);
            callback(null, false);
          }
          db.collection("tweets").updateOne({ _id: ObjectId(tId) }, { $set: { "likes": result.likes }});
        });
      });
    }
  }
}
