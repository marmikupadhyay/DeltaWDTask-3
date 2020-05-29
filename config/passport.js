const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

//Bringing in User
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy((username, password, done) => {
      //Check for USER
      User.findOne({ username: username }).then(user => {
        //If Not Found
        if (!user) {
          console.log("huh2");
          return done(null, false, { message: "Invalid Credentials" });
        }
        //If Found check password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (isMatch) {
            //Password Matches , user returned
            return done(null, user);
          } else {
            //Password dosen't match
            console.log("huh");
            return done(null, false, { message: "Invalid Credentials" });
          }
        });
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
