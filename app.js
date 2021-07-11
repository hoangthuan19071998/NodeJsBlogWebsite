var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
var passport = require("passport");
var FacebookStrategy = require("passport-facebook").Strategy;
var GoogleStrategy = require("passport-google-oauth2").Strategy;
const loginFb = require("./loginFb.js");
const config = require("./config/fbConfig.js");
var db = require("./models");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var postsRouter = require("./routes/posts");
var loginRouter = require("./routes/login");
// const passport = require("passport");
var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebookAuth.clientID,
      clientSecret: config.facebookAuth.clientSecret,
      callbackURL: config.facebookAuth.callbackURL,
      profileFields: ["email", "displayName", "locale", "gender"],
    },
    function (accessToken, refreshToken, profile, done) {
      let user = {
        fbId: profile._json.id,
        name: profile._json.name,
        email: profile._json.email,
      };
      db.users
        .findOrCreate({
          where: {
            email: user.email,
          },
          defaults: user,
        })
        .then((result) => {
          done(null, user);
          console.log(result[0].dataValues);
        })
        .catch((err) => done(err));
      return done(null, profile);
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "1066907954945-tm7na7m11g3f8lrn0rtkdpq2vh02c4p3.apps.googleusercontent.com",
      clientSecret: "L7rqgVYIiKuovPNGtFOij6r8",
      callbackURL: "http://localhost:1234/login/auth/gg/cb",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use("/login", loginFb);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
app.listen(1234, () => {
  console.log("running on port 1234");
});

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

module.exports = app;
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });
// passport.deserializeUser((id, done) => {
//   db.findOne({ id }, (err, user) => {
//     if (err) {
//       console.log("derserial");
//     }
//     done(null, user);
//   });
// });
