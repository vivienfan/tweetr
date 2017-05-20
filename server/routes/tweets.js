"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {

  // when user want to get load all tweets,
  // call DataHelpers to ineract with database.
  // if there is session cookie, but client does not have the info,
  // ask DataHelpers to get the user info as well.
  // send back both tweets and user info back to client
  tweetsRoutes.get("/", function(req, res) {
    let userId = req.body.getUserInfo ? false : req.session.user_id;
    DataHelpers.getTweets(userId, (err, userInfo, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({
          userInfo: userInfo,
          tweets: tweets
        });
      }
    });
  });

  // when user want to add a new tweet
  // call DataHelpers to interact with the database.
  tweetsRoutes.post("/", function(req, res) {
    if (!req.body) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const tweet = {
      user: {
        name: req.body.name,
        handle: req.body.handle,
        avatars: { small: req.body.avatar },
      },
      content: {
        text: req.body.content
      },
      created_at: Date.now(),
      likes: []
    };

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send(); // created
      }
    });
  });

  // when user click a like button
  // call DataHelpers to updata the database,
  // and detect either it is a like or un-like action
  tweetsRoutes.post("/:id/:user", function(req, res) {
    DataHelpers.updateLikes(req.params.id, req.params.user, (err, like) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json(like); //created
      }
    });
  });

  return tweetsRoutes;
}
