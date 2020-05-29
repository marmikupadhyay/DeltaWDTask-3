const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

//Get Request Routes

router.get("/", forwardAuthenticated, (req, res) => {
  res.redirect("/login");
});

router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login");
});

router.get("/signup", forwardAuthenticated, (req, res) => {
  res.render("signup");
});

//Login Handle
router.post("/login", (req, res, next) => {
  let errors = [];
  const { username, password } = req.body;
  if (!username || !password) {
    errors.push({ msg: "Fill All Fields" });
    res.render("login", { errors });
  } else {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        errors.push({ msg: "Invalid Credentials" });
        return res.render("login", { errors });
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.redirect("/user/panel");
      });
    })(req, res, next);
  }
});

//Handling Signups

router.post("/signup", (req, res) => {
  let errors = [];
  const { username, mail, pass } = req.body;
  if (!username || !mail || !pass) {
    errors.push({ msg: "Fill All Fields" });
  }

  if (errors.length > 0) {
    res.render("signup", { errors, username, mail, pass });
  } else {
    //Validation Passed
    User.findOne({ username: username })
      .then(user => {
        if (user) {
          errors.push({ msg: "User Already Exists" });
          res.render("signup", { errors, username, mail, pass });
        } else {
          const newUser = new User({
            username,
            email: mail,
            password: pass
          });

          //HASH PASSWORD
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;

              //Set the new hashed password
              newUser.password = hash;

              //Saving the use to DB
              newUser
                .save()
                .then(user => {
                  //Redirecting to login page
                  req.flash(
                    "success_msg",
                    "You are now registered and can log in"
                  );
                  res.redirect("/login");
                })
                .catch(err => {
                  console.log(err);
                });
            });
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
});

//User Api for search bar
router.get("/api/users", ensureAuthenticated, (req, res) => {
  User.find({})
    .then(users => {
      res.json(users);
    })
    .catch(err => console.log(err));
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
});

//Exporting Router
module.exports = router;
