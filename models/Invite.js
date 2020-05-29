const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema({
  header: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  footer: {
    type: String,
    required: true
  },
  creator: mongoose.Schema.Types.ObjectId,
  creatorName: {
    type: String,
    required: true
  },
  accepted: [mongoose.Schema.Types.ObjectId],
  rejected: [mongoose.Schema.Types.ObjectId],
  sendto: [mongoose.Schema.Types.ObjectId],
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  sendto: [String],
  global: {
    type: Boolean,
    default: true
  }
});

const Invite = mongoose.model("Invite", inviteSchema);

module.exports = Invite;
