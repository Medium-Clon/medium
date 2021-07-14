const express = require("express");
const Router = express.Router();
const adminController = require("../controllers/admin")

Router.get(`/admin_login`,adminController.admin_get_login);

Router.post(`/admin_login`,adminController.admin_post_login);

Router.post(`/admin_sign_up`,adminController.admin_post_signup);

module.exports = Router;