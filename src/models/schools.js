const mongoose = require("mongoose");
const crypto = require("crypto");

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "School name is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },
    address: {
      type: String,
      required: [true, "School address is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "School email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    token: {
      type: String,
      default: crypto.randomBytes(16).toString("hex"),
    },
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  },
);

const Schools = mongoose.model("Schools", schoolSchema);

module.exports = Schools;
