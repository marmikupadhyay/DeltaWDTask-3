const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  about: {
    type: String,
    default: "Hey There Checkout my posts."
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId]
  },
  following: {
    type: [mongoose.Schema.Types.ObjectId]
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
