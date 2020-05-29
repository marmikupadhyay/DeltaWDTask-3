const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Invite = require("../models/Invite");
const { ensureAuthenticated } = require("../config/auth");

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
  const { header, body, footer, date, time, sendto, all } = req.body;
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
    global: global
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
        res.render("maininvite", { user: req.user, invite });
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
      req.flash("success_msg", "Invite Accepted");
      res.redirect("/user/panel");
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

module.exports = router;
