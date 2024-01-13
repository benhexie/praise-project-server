require("dotenv").config({ path: `${__dirname}/../../.env` });
const jwt = require("jsonwebtoken");

const genToken = (data) => {
  data.id = data.id || data._id;
  delete data._id;

  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
};

module.exports = { genToken };
