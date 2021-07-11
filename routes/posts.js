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

module.exports = router;
