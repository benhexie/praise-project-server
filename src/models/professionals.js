const mongoose = require("mongoose");

const professionalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    experience: [
      {
        company: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        location: {
          type: String,
          required: true,
        },
        from: {
          type: Date,
          required: true,
        },
        to: Date,
        current: {
          type: Boolean,
          default: false,
        },
        description: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    education: [
      {
        school: {
          type: String,
          required: true,
        },
        degree: String,
        field: String,
        from: {
          type: Date,
          required: true,
        },
        to: {
          type: Date,
          required: true,
        },
        grade: String,
        current: {
          type: Boolean,
          default: false,
        },
        description: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    catalog: [
      {
        type: {
          type: String,
          enum: ["project", "publication", "patent"],
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        description: String,
        links: [String],
        from: {
          type: Date,
          required: true,
        },
        to: Date,
        current: {
          type: Boolean,
          default: false,
        },
        image: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Professionals = mongoose.model("Professionals", professionalSchema);

module.exports = Professionals;
