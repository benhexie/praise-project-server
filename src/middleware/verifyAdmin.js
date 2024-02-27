const Users = require("../models/users");
const Response = require("../utils/response");

const verifyAdmin = async (req, res, next) => {
  const { failed } = new Response(res);
  const id = req.data.id;

  try {
    const user = await Users.findOne({
      _id: id,
      role: "admin",
    });
    if (!user) return failed("Unauthorized", "Unauthorized", 401);
    next();
  } catch (error) {
    console.log(error.message);
    return failed("Internal server error", "Internal server error", 500);
  }
};

module.exports = verifyAdmin;
