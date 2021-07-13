var express = require("express");
var router = express.Router();
var db = require("../models");
/* GET home page. */
router.get("/", function (req, res, next) {
  db.posts.findAll().then((posts) => {
    res.render("home", { posts: posts });
  });
});

module.exports = router;
