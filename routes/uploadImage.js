var express = require("express");
var router = express.Router();
var db = require("../models");
var multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + "-" + Date.now());
  },
});
var upload = multer({ storage: storage });
router.post("/", upload.single("image"), function (req, res, next) {
  if (req.files) {
    res.send("haha");
  }
});
module.exports = router;
