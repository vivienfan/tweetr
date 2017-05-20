"use strict";

const ObjectId = require("mongodb").ObjectID;
const bcrypt = require('bcrypt');

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {
    // Saves a new user to db
    register: function(userInfo, avatars, callback) {
      // check if the username is already used
      db.collection("users").find({ handle: `@${userInfo.username}` }).toArray((err, array) => {
        if (err) {
          callback(err, null, null, null);
          return;
        }
        if (array.length !==0) {
          callback(null, true, false, null);
          return;
        }

        // check if the email is already registered
        db.collection("users").find({ email: userInfo.email }).toArray((err, array) => {
          if (err) {
            callback(err, null, null, null);
            return;
          }
          if (array.length !== 0) {
            callback(null, false, true, null);
            return;
          }

          // insert the new user
          db.collection("users").insertOne(
            {
              first_name: userInfo.fname,
              last_name: userInfo.lname,
              handle: `@${userInfo.username}`,
              email: userInfo.email,
              avatars: avatars,
              password:  bcrypt.hashSync(userInfo.password, 10)
            }, (err, result) => {
              if (err) {
                callback(err, null, null, null);
                return;
              }
              callback(null, true, true, {
                id: result.insertedId,
                name: `${result.ops[0].first_name} ${result.ops[0].last_name}`,
                handle: result.ops[0].handle,
                avatar: result.ops[0].avatars.small
              });
            }
          );
        });
      });
    },

    login: function(key, password, callback){
      db.collection("users").find({ $or: [ { handle: `@${key}` }, { email: key } ] }).toArray((err, array) => {
        if (err) {
          callback(err, null);
          return;
        }
        if(!array[0]){
          callback(null, null);
          return;
        }
        if (bcrypt.compareSync(password, array[0].password)) {
          callback(null, {
            id: array[0]._id,
            name: `${array[0].first_name} ${array[0].last_name}`,
            handle: array[0].handle,
            avatar: array[0].avatars.small
          });
        } else {
          callback(null, null);
        }
      });
    },

    // Saves a tweet to db
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet);
      callback(null, true);
    },

    // Get all tweets in db, sorted by newest first
    getTweets: function(userId, callback) {
      const sortNewestFirst = (a, b) => a.created_at - b.created_at;
      db.collection("tweets").find().toArray((err, arr_tweets) => {
        if (err) {
          callback(err, null, null);
          return;
        }
        if (userId) {
          db.collection("users").find({ _id: ObjectId(userId) }).toArray((err, arr_user) => {
            if (err) {
              callback(err, null, null);
              return;
            }
            if (arr_user[0]) {
              callback(null, {
                handle: arr_user[0].handle,
                name: `${arr_user[0].first_name} ${arr_user[0].last_name}`,
                avatar: arr_user[0].avatars.small
              }, arr_tweets.sort(sortNewestFirst));
            } else {
              callback(null, null, arr_tweets.sort(sortNewestFirst));
            }
          });
        } else {
          callback(null, null, arr_tweets.sort(sortNewestFirst));
        }
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
