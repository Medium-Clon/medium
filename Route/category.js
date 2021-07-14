const express = require("express");
const Router = express();
const categoryCon = require("../controllers/category");
const auth = require("../helpers/jwt");
Router.post("/category",auth,categoryCon.category);

Router.get("/show_category",auth,categoryCon.all_category);

Router.get("/category/:_id",auth,categoryCon.sortCategory);


module.exports = Router;