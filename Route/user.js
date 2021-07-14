const express = require("express");
const Router = express.Router();
const User = require("../controllers/user")



Router.get(`/sign_up`,User.get_signup);

Router.post(`/sign_up`,User.post_signup);

Router.get(`/login`,User.get_login);

Router.post(`/login`,User.post_login);

Router.put(`/follow`,User.follow);

Router.put(`/unfollow`,User.unfollow);

module.exports = Router;