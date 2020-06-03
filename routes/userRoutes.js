const express = require("express");
const router = express.Router();
const webpush = require("web-push");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const nodemailer = require("nodemailer");
const fetch = require("node-fetch");

const User = require("../models/User");
const Invite = require("../models/Invite");
const { ensureAuthenticated } = require("../config/auth");

//Setting Up Web Push
const publicVapidKey =
  "BCcwLqPym6940WywTkUOghInLWQBdUGIqHER9D9dzNeZUD-QEztH5UYe1UgOsOyaIJXL209TRnjFTnqlJphU2Do";
const privateVapidKey = "RywDykHUfS2nhtdnh8hzSUJrg2kprHMWkaL7rRfhgcU";

webpush.setVapidDetails(
  "mailto:test@test.com",
  publicVapidKey,
  privateVapidKey
);

//Get Request to Main Panel
router.get("/panel", ensureAuthenticated, (req, res) => {
  Invite.find({}) //Finding all the Invites
    .then(allInvites => {
      //Finding Invites to the specific user
      Invite.find({ creator: req.user._id })
        .then(userInvites => {
          res.render("userpanel", {
            user: req.user,
            allInvites, //sending all Invites
            userInvites //sending user specific Invites
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

//Handleing Invite addition
router.post("/add", ensureAuthenticated, (req, res) => {
  const {
    header,
    body,
    footer,
    date,
    time,
    sendto,
    all,
    question,
    deadline
  } = req.body;
  var global;
  var sendtousers;
  if (all == "on") {
    global = true;
  } else {
    global = false;
    sendtousers = sendto.trim().split(" ");
  }
  const newInvite = new Invite({
    header,
    body,
    footer,
    creator: req.user._id,
    creatorName: req.user.username,
    date: date,
    time: time,
    sendto: sendtousers,
    global: global,
    question,
    deadline: deadline
  });
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env["USER_EMAIL"], // generated ethereal user
      pass: process.env["USER_PASS"] // generated ethereal password
    }
  });
  User.find({})
    .then(users => {
      users.forEach(user => {
        if (!newInvite.global) {
          if (
            sendtousers.includes(user.username) &&
            user.username != req.user.username
          ) {
            let info = transporter.sendMail({
              from: '"InviteBook App" <initebook.ib@gmail.com>', // sender address
              to: user.email, // list of receivers
              subject: "New Invitation", // Subject line
              text: newInvite.body, // plain text body
              html: newInvite.body // html body
            });

            //Adding To the notifications of the reciver.
            User.findOneAndUpdate(
              { _id: user._id },
              {
                $push: {
                  notifications: `${req.user.username} sent a new invite - ${newInvite.header}.`
                }
              },
              (err, doc, res) => {}
            );
          }
        } else if (user.username != req.user.username) {
          let info = transporter.sendMail({
            from: '"InviteBook App" <initebook.ib@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: "New Invitation", // Subject line
            text: newInvite.body, // plain text body
            html: newInvite.body // html body
          });

          //Adding To the notifications of the reciver.
          User.findOneAndUpdate(
            { _id: user._id },
            {
              $push: {
                notifications: `${req.user.username} sent a new invite - ${newInvite.header}.`
              }
            },
            (err, doc, res) => {}
          );
        }
      });

      newInvite
        .save()
        .then(invite => {
          req.flash("success_msg", "Invite Created");
          res.redirect("/user/panel");
        })
        .catch(err => {
          console.log(err);
          req.flash("error_msg", "Fill All Fields");
          res.redirect("/user/panel");
        });
    })
    .catch(err => console.log(err));
});

//Handling Invite Deletion
router.get("/delete:id", ensureAuthenticated, (req, res) => {
  Invite.findOneAndDelete({ _id: req.params.id })
    .then(post => {
      req.flash("success_msg", "Invite Deleted");
      res.redirect("/user/panel");
    })
    .catch(err => {
      err;
    });
});

//Handling invite editing
router.post("/edit:id", ensureAuthenticated, (req, res) => {
  const { header, body, footer } = req.body;
  var updatedInvite = {
    $set: {
      header,
      body,
      footer
    }
  };
  Invite.findOneAndUpdate({ _id: req.params.id }, updatedInvite)
    .then(invite => {
      req.flash("success_msg", "Invite Edited");
      res.redirect("/user/panel");
    })
    .catch(err => {
      req.flash("error_msg", "Fill All fields");
      res.redirect("/user/panel");
    });
});

//Handling Indiviual Invite View requests  (Dynamic Invite Url)
router.get("/view/:id", ensureAuthenticated, (req, res) => {
  Invite.findOne({ _id: req.params.id })
    .then(invite => {
      if (!invite) {
        res.render("404", { user: req.user });
      } else {
        User.find({})
          .then(users => {
            var today = new Date();
            var deadline = new Date(invite.deadline);
            res.render("maininvite", {
              user: req.user,
              invite,
              allUsers: users,
              today,
              deadline
            });
          })
          .catch(err => {
            console.log(err);
          });
      }
    })
    .catch(err => {
      res.render("404", { user: req.user });
    });
});

//Handling Accepting of Invites
router.get("/accept/:id", ensureAuthenticated, (req, res) => {
  Invite.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        accepted: req.user._id
      }
    }
  )
    .then(invite => {
      //Adding to the notifications of the creator
      User.findOneAndUpdate(
        { _id: invite.creator },
        {
          $push: {
            notifications: `${req.user.username} accepted your ${invite.header} Invite.`
          }
        }
      )
        .then(user => {
          req.flash("success_msg", "Invite Accepted");
          res.redirect("/user/panel");
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => console.log(err));
});

//Handling Rejection of Invites
router.get("/reject/:id", ensureAuthenticated, (req, res) => {
  Invite.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        rejected: req.user._id
      }
    }
  )
    .then(invite => {
      req.flash("success_msg", "Invite Rejected");
      res.redirect("/user/panel");
    })
    .catch(err => console.log(err));
});

//Handling User Responses of Invites

router.post("/answer/:id", ensureAuthenticated, (req, res) => {
  const { answer } = req.body;
  var useranswer = {
    name: req.user.username,
    answer
  };
  Invite.findOneAndUpdate(
    { _id: req.params.id },
    {
      $addToSet: {
        answers: useranswer
      }
    }
  )
    .then(invite => {
      res.redirect(`/user/view/${req.params.id}`);
    })
    .catch(err => console.log(err));
});

//Handling Notification Deletion
router.get("/notification/delete/:text", ensureAuthenticated, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { $pull: { notifications: req.params.text } }
  )
    .then(user => {
      res.redirect("/user/panel");
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
