const express = require("express");
const Router = express();
const articleCon = require("../controllers/article");
const auth = require("../helpers/jwt");

//get all articles
Router.get(`/articles`,auth,articleCon.all_article);

//create category
Router.post(`/articles`,auth,articleCon.create_article);

//view specific post
Router.get(`/article/:_id`,auth,articleCon.one_article);

//user comment
Router.put(`/comment`,auth,articleCon.comment);


//search article
Router.post(`/search-article`,auth,articleCon.search_article)


Router.put(`/like`,auth,articleCon.like);

Router.put(`/unlike`,auth,articleCon.unlike);



//report post
Router.put(`/report_post`,auth,articleCon.report);



module.exports = Router;