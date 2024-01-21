const Schools = require("../models/schools");
const Users = require("../models/users");
const Response = require("../utils/response");
const crypto = require("crypto");

const changeToken = async (req, res) => {
  const { success, failed } = new Response(res);
  const id = req.data.id;

  try {
    // get user
    const userData = await Users.findOne({ _id: id }, { password: 0 });
    if (!userData) return failed("Token not changed", "User not found", 404);
    const user = userData.toObject();

    if (user.role !== "admin")
      return failed("Token not changed", "Unauthorized", 401);

    // get school
    const token = crypto.randomBytes(16).toString("hex");
    const schoolData = await Schools.updateOne({ _id: user.school }, { token });
    if (!schoolData) return failed("School not found", "School not found", 404);

    return success("Token changed successfully", {
      token,
    });
  } catch (error) {
    console.log(error.message);
    return failed("Internal server error", "Internal server error", 500);
  }
};

module.exports = { changeToken };
