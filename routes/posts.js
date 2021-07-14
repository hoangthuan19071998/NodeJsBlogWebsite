var express = require("express");
var router = express.Router();
var db = require("../models");
const users = require("../models/users");
//get all
router.get("/", function (req, res, next) {
  db.posts
    .findAll({
      include: ["author"],
    })
    .then((posts) => {
      console.log(posts);
      res.render("home", { data: posts, title: "Trang chủ" });
    });
});
// create
router.post("/", function (req, res) {
  let form = req.body;
  db.posts.create(form).then((result) => {
    res.send({ error: false, data: result, message: "Create success" });
  });
  console.log(form);
});
router.get("/upload", (req, res) => {
  res.render("postUpload");
});

router.get("/:id", (req, res) => {
  db.posts
    .findOne({
      where: {
        id: req.params.id,
      },
      include: ["author"],
    })
    .then((posts) => {
      res.render("post", { posts: posts });
    });
});
router.get("/user/:id", (req, res) => {
  db.posts
    .findAll({
      where: {
        authorId: req.params.id,
      },
      include: ["author"],
    })
    .then((posts) => {
      res.render("userBlog", { posts: posts, userId: req.cookies["user"] });
    });
});
module.exports = router;
