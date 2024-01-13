const mongoose = require("mongoose");

const DB_URI = process.env.DB_URI;

mongoose.connect(DB_URI, { autoIndex: true });

const conn = mongoose.connection;

conn.on("open", () => {
  console.error.bind(console, "Connection to Database is successful");
});

conn.on("error", () => {
  console.error.bind(console, "Connection error");
});

module.exports = conn;
