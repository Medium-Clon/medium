const {api} = require("./helpers/keys");
const express = require("express");
const app = express();
// /const cors = require("cors")
// /const morgan = require("morgan");
const {connection} = require("./db")


//Routers
const home = require("./Route/home");
const users = require("./Route/user");
const admin = require("./Route/admin");
const articles = require("./Route/articles")
const category = require("./Route/category")



//connecting to database
connection();


app.use(express.json());
//app.use(cors())
app.use(`${api}/`,home);
app.use(`${api}/`,users);
app.use(`${api}/`,admin);
app.use(`${api}/`,articles);
app.use(`${api}/`,category);

//error handler
app.use((error, req, res, next) => {
    res.status(500).json({ error: error.message });
  });
  

PORT = process.env.PORT || 5000;
app.listen(PORT,console.log(`App Running on ${PORT}`));

module.exports = app;

