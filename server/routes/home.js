"use strict";

const userHelper = require("../lib/util/user-helper")

const express       = require('express');
const homeRoutes  = express.Router();

module.exports = function(DataHelpers) {

  // when user want to login,
  // call DataHelpers to interact with database for credential checking
  // on success, set session cookie, send back user info
  homeRoutes.post("/login", function(req, res) {
    DataHelpers.login(req.body.key, req.body.password, (err, userInfo) => {
      if (err) {
        res.status(500).json({error: err.message});
      } else {
        if (userInfo) {
          req.session.user_id = userInfo.id
          res.status(200).json({
            name: userInfo.name,
            handle: userInfo.handle,
            avatar: userInfo.avatar
          });
        } else {
          res.status(403).send(); // forbidden
        }
      }
    })
  });

  // when user want to logout,
  // clear session cookie
  homeRoutes.post("/logout", function(req, res) {
    req.session.user_id = null;
    res.status(200).send();
  });

  // when user want to register,
  // call DataHelpers to interact with database for error checking and updating database
  // on success, set session cookie, send back user info
  // else, send back error for email or username already registered
  homeRoutes.post("/register", function(req, res) {
    const avatars = userHelper.generateRandomAvatar(req.body.username);
    DataHelpers.register(req.body, avatars, (err, emailOk, usernameOk, userInfo) => {
      if (err) {
        res.status(500).json({error: err.message});
      } else {
        if (emailOk && usernameOk) {
          // create cookie
          req.session.user_id = userInfo.id;
          res.status(201).json({  // created
            name: userInfo.name,
            handle: userInfo.handle,
            avatar: userInfo.avatar
          });
        } else {
          res.status(400).json({  // bad request
            emailOk: emailOk,
            usernameOk: usernameOk
          });
        }
      }
    });
  });

  // homeRoutes.put("/settings", function(req, res) {
  // });

  return homeRoutes;
}