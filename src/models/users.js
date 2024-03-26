const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    firstname: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "staff", "viewer"],
      required: [true, "Role is required"],
      default: "user",
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schools",
      required: [true, "School is required"],
    },
    token: {
      type: String,
      required: [true, "Token is required"],
    },
    age: {
      type: Number,
      min: 18,
      max: 200,
    },
    origin: String,
    nationality: String,
    phone: String,
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    maxCredits: {
      type: Number,
      default: 15,
    },
  },
  {
    timestamps: true,
  },
);

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
