const Response = require("../utils/response");
const Users = require("../models/users");

const grantViewer = async (req, res) => {
  const { success, failed } = new Response(res);
  const { id } = req.params;
  const grant = req.body.grant;

  const successMessage = grant ? "Viewer granted" : "Viewer revoked";
  const errorMessage = grant ? "Viewer not granted" : "Viewer not revoked";

  try {
    const update = await Users.findByIdAndUpdate(
      id,
      { role: grant ? "viewer" : "staff" },
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

module.exports = { grantViewer };
