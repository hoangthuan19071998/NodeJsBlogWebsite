const passport = require("passport");
const express = require("express");
var router = express.Router();

router.get("/profile", isLoggedIn, function (req, res) {
  res.render("profile", {
    user: req.user._json, // get the user out of session and pass to template
  });
});

router.get("/error", isLoggedIn, function (req, res) {
  res.render("error");
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
