var express = require("express");
var router = express.Router();
var db = require("../models");
//get all
router.get("/", function (req, res, next) {
  db.posts.findAll().then((results) => {
    res.render("home", { data: results, title: "Trang chủ" });
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
  res.render("post");
  // db.posts
  //   .findOne({
  //     where: {
  //       id: req.params.id,
  //     },
  //   })
  //   .then((result) => {
  //     res.send({ error: false, data: result });
  //   });
});
module.exports = router;
