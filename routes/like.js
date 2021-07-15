var express = require("express");
var router = express.Router();
var db = require("../models");
router.get("/:postid", (req, res) => {
  let info = {
    postid: req.params.postid,
    uid: req.cookies["user"],
  };
  if (info.uid) {
    db.like
      .findOrCreate({
        where: {
          postid: info.postid,
          uid: info.uid,
        },
        defaults: info,
      })
      .then((result) => {
        if (result[1]) {
          db.like
            .destroy({
              where: {
                postid: info.postid,
                uid: info.uid,
              },
            })
            .then();
        }

        // res.cookie("user", result[0].id);
        // res.redirect("/users/profile/" + result[0].id);
      })
      .catch((err) => res.send(err));
  }
});

module.exports = router;
