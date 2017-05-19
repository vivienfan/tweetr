"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {

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
        res.status(201).send();
      }
    });
  });

  tweetsRoutes.post("/:id/:user", function(req, res) {
    DataHelpers.updateLikes(req.params.id, req.params.user, (err, like) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json(like);
      }
    });
  });

  return tweetsRoutes;

}
