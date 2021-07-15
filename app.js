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
const login = require("./login.js");
const config = require("./config/fbConfig.js");
var db = require("./models");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();
const fs = require("fs");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var postsRouter = require("./routes/posts");
var loginRouter = require("./login");
var uploadImage = require("./routes/uploadImage");
var likeFunction = require("./routes/like");

// server side
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
io.on("connection", function (socket) {
  socket.on("like", (info) => {
    db.like.create(info).then((result) => {
      socket.emit("isLiked", true);
    });
  });
  socket.on("unlike", (info) => {
    db.like
      .destroy({
        where: {
          postid: info.postid,
          uid: info.uid,
        },
      })
      .then((result) => {
        socket.emit("isLiked", false);
      });
  });
});

server.listen(1234, function () {
  console.log("Node app is running on port 1234");
});

// const passport = require("passport");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", indexRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);
app.use("/uploadImage", uploadImage);
app.post("/upload", multipartMiddleware, (req, res) => {
  try {
    fs.readFile(req.files.upload.path, function (err, data) {
      var newPath = __dirname + "/public/images/" + req.files.upload.name;
      fs.writeFile(newPath, data, function (err) {
        if (err) console.log({ err: err });
        else {
          console.log(req.files.upload.originalFilename);
          let fileName = req.files.upload.name;
          let url = "/images/" + fileName;
          let msg = "Upload successfully";
          let funcNum = req.query.CKEditorFuncNum;
          console.log({ url, msg, funcNum });

          res
            .status(201)
            .send(
              "<script>window.parent.CKEDITOR.tools.callFunction('" +
                funcNum +
                "','" +
                url +
                "','" +
                msg +
                "');</script>"
            );
        }
      });
    });
  } catch (error) {
    console.log(error.message);
  }
});
app.use("/like", likeFunction);
app.use(passport.initialize());
app.use(passport.session());
app.get("/private", (req, res) => {
  if (req.isAuthenticated()) {
    res.send("welcome to private page");
  } else {
    res.send("bạn chưa đăng nhập");
  }
});
passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebookAuth.clientID,
      clientSecret: config.facebookAuth.clientSecret,
      callbackURL: config.facebookAuth.callbackURL,
      profileFields: ["email", "displayName", "locale", "gender"],
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(user);
      let user = {
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
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleAuth.client_id,
      clientSecret: config.googleAuth.client_secret,
      callbackURL: config.googleAuth.callbackURL,
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      let user = {
        name: profile._json.name,
        email: profile._json.email,
      };
      console.log(user);
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
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use("/login", loginRouter);
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
module.exports = app;
