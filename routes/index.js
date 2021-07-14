var express = require("express");
var router = express.Router();
var db = require("../models");
/* GET home page. */
router.get("/", function (req, res, next) {
  db.posts
    .findAll({
      include: ["author"],
    })
    .then((posts) => {
      res.render("home", { posts: posts, userId: req.cookies["user"] });
    });
});

module.exports = router;
