const passport = require("passport");
const express = require("express");
var router = express.Router();

router.get("/profile", isLoggedIn, function (req, res) {
  res.render("profile", {
    user: req.user, 
  });
});

router.get("/error", isLoggedIn, function (req, res) {
  res.render("error");
});

router.get(
  "/auth/fb",
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"],
  })
);

router.get(
  "/auth/fb/cb",
  passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/error",
  })
);

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;
