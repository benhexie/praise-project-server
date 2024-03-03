const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["feedback", "complaint", "suggestion", "question"],
      required: true,
      default: "feedback",
    },
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Messages = mongoose.model("Messages", messageSchema);

module.exports = Messages;
