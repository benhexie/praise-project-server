require("dotenv").config({ path: `${__dirname}/../../.env` });
const Response = require("../utils/response");
const jwt = require("jsonwebtoken");

const authToken = (req, res, next) => {
  const { failed } = new Response(res);
  const authToken = req.headers["authorization"];
  const token = authToken && authToken.split(" ")[1];

  if (!token) return failed("No token provided", "No token provided", 401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) return failed("Invalid token", "Invalid token", 403);
    req.data = data;
    next();
  });
};

module.exports = { authToken };
