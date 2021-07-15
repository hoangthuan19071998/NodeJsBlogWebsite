var express = require("express");
var router = express.Router();
var db = require("../models");
/* GET home page. */
router.get("/", isLoggedIn, function (req, res, next) {
  db.posts
    .findAll({
      include: ["author"],
    })
    .then((posts) => {
    
      res.render("home", { posts: posts, userId: req.cookies["user"] });
    });
});
function isLoggedIn(req, res, next) {
  if (req.cookies["user"]) return next();
  res.redirect("/login");
}

module.exports = router;
