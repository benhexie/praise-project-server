require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { signup } = require("./routes/signup");
const { login } = require("./routes/login");

const app = express();
const PORT = process.env.PORT || 3000;
require("./models/connection");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET
app.get("/", (req, res) => {
  res.send("Hello World");
});

// POST
app.post("/signup", signup);
app.post("/login", login);

const listener = app.listen(PORT, () => {
  console.log(`Server is running on port ${listener.address().port}`);
});
