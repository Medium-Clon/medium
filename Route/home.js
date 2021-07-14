const express = require("express");
const Router = express.Router();
const home = require("../controllers/home");
const auth = require("../helpers/jwt")


Router.get('/',auth,home.home)

module.exports = Router;