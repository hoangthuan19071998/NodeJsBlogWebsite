var express = require("express");
var router = express.Router();
var db = require("../models");

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
router.get("/upload", isLoggedIn, (req, res) => {
  res.render("postUpload", {
    userId: req.cookies["user"],
  });
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
      db.like
        .findAll({
          where: {
            postid: posts.id,
          },
          include: ["userLiked"],
        })
        .then((like) => {
          res.send({
            posts: posts,
            userLike: like,
            userId: req.cookies["user"],
          });
          // res.render("post", {
          //   posts: posts,
          //   userLike: like,
          //   userId: req.cookies["user"],
          // });
        });
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
function isLoggedIn(req, res, next) {
  let user = req.cookies["user"];
  if (user) {
    db.users
      .findOne({
        where: {
          id: req.cookies["user"],
        },
      })
      .then((user) => {
        let info = user.dataValues;
        if (info.phoneNumber == null || info.job == null) {
          res.redirect("/user/profile" + user);
        } else {
          next();
        }
      });
  } else {
    res.redirect("/login");
  }
}
module.exports = router;
