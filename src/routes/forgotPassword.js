const { initializeApp } = require("firebase/app");
const firebaseConfig = require("../../firebaseConfig");
const { getAuth, sendPasswordResetEmail } = require("firebase/auth");
const Response = require("../utils/response");
const Users = require("../models/users");

const app = initializeApp(firebaseConfig);

const forgotPassword = async (req, res) => {
  const { success, failed } = new Response(res);
  const email = req.body.email;

  if (!email) return failed("Password reset failed", "Email is required");

  const auth = getAuth(app);
  try {
    if (!(await Users.findOne({ email })))
      return failed("Password reset failed", "User not found");
    await sendPasswordResetEmail(auth, email);
    return success("Check your email for password reset link", {});
  } catch (error) {
    console.error(error.message);
    if (error.code === "auth/user-not-found")
      return failed("Password reset failed", "User not found");
    if (error.code === "auth/invalid-email")
      return failed("Password reset failed", "Email is invalid");
    return failed("Password reset failed", "Something went wrong");
  }
};

module.exports = { forgotPassword };
