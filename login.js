const passport = require("passport");
const express = require("express");
var router = express.Router();
var db = require("./models");
router.get("/", (req, res) => {
  res.render("login");
});
router.get("/profile", isLoggedIn, function (req, res) {
  db.users
    .findOne({
      where: {
        email: req.user._json.email,
      },
    })
    .then((user) => {
      let info = user.dataValues;
      if (info.phoneNumber == null || info.job == null) {
        res.render("profile", {
          user: info,
        });
      } else {
        res.redirect("/");
      }
    });
});

router.get("/auth/fb", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/auth/fb/cb",
  passport.authenticate("facebook", {
    successRedirect: "/login/profile",
    failureRedirect: "/error",
  })
);

router.get(
  "/auth/gg",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/auth/gg/cb",
  passport.authenticate("google", {
    successRedirect: "/login/profile",
    failureRedirect: "/error",
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("Goodbye!");
});

router.get("/auth/google/failure", (req, res) => {
  res.send("Failed to authenticate..");
});

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}
module.exports = router;
