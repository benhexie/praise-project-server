require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET
app.get("/", (req, res) => {
  res.send("Hello World");
});

const listener = app.listen(PORT, () => {
  console.log(`Server is running on port ${listener.address().port}`);
});
