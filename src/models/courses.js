const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
  code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String || null,
    default: null,
    trim: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId || null,
    ref: "User",
    default: null,
  },
});

const Courses = mongoose.model("Course", courseSchema);

module.exports = Courses;
