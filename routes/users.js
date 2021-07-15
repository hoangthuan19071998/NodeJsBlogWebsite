var express = require("express");
var router = express.Router();
var db = require("../models");
/* GET users listing. */

router.post("/login", (req, res) => {
  let user = {
    email: req.body.email,
    name: req.body.name,
  };
  db.users
    .findOrCreate({
      where: {
        email: user.email,
      },
      defaults: user,
    })
    .then((result) => {
      res.cookie("user", result[0].id);
      res.redirect("/users/profile/" + result[0].id);
    })
    .catch((err) => res.send(err));
});

router.get("/profile/:id", isLoggedIn, function (req, res) {
  db.users
    .findOne({
      where: {
        id: req.params.id,
      },
    })
    .then((user) => {
      console.log(user);
      let info = user.dataValues;

      res.render("profile", {
        user: info,
        userId: req.cookies["user"],
      });
    });
});

// router.post("/", function (req, res) {
//   let form = req.body;
//   db.users.create(form).then((result) => {
//     res.send({ error: false, data: result, message: "Create success" });
//   });
// });
router.post("/update", (req, res) => {
  let user = req.body;
  if (user.phoneNumber == "" || user.job == "") {
    return res.end("Phone number or job is not allowed to be null");
  }
  db.users
    .update(
      { name: user.name, phoneNumber: user.phoneNumber, job: user.job },
      {
        where: {
          email: user.email,
        },
      }
    )
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      res.end("có lỗi");
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
