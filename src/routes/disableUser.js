const Response = require("../utils/response");
const Users = require("../models/users");

const disableUser = async (req, res) => {
  const { success, failed } = new Response(res);
  const { id } = req.params;
  const disable = req.body.disable;

  const successMessage = disable ? "User disabled" : "User enabled";
  const errorMessage = disable ? "User not disabled" : "User not enabled";

  try {
    const update = await Users.findByIdAndUpdate(
      id,
      { disabled: disable },
      { new: true },
    );
    if (!update) return failed(errorMessage, "User not found");
    success(successMessage, update);
  } catch (err) {
    console.error(err.message);
    if (err.name === "CastError") return failed(errorMessage, "Invalid user");
    failed(errorMessage, "Something went wrong");
  }
};

module.exports = { disableUser };
