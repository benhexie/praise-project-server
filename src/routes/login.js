const Response = require("../utils/response");
const { initializeApp } = require("firebase/app");
const firebaseConfig = require(`${__dirname}/../../firebaseConfig`);
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { genToken } = require("../utils/genToken");
const Users = require("../models/users");

const app = initializeApp(firebaseConfig);

const login = async (req, res) => {
  const { success, failed } = new Response(res);
  const email = req.body.email?.trim();
  const password = req.body.password;
  const reason = req.body.reason;
  const auth = getAuth(app);

  const errors = inputErrors({ email, password, reason });
  if (errors.length) return failed("Login failed", errors.join("\n"));

  try {
    const userData = await Users.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    if (!userData) return failed("User not found", "User not found", 404);

    const userCredential = await signInWithEmailAndPassword(
      auth,
      userData.email,
      password
    );
    const user = userCredential.user;
    if (!user.emailVerified)
      return failed("Login failed", "Please verify your email", 400);

    await Users.updateOne(
      { _id: userData._id },
      { lastLogin: Date.now(), password }
    );
    return success("User logged in", {
      token: genToken({ id: userData._id }),
    });
  } catch (error) {
    console.log(error.message);
    return failed("Internal server error", "Internal server error", 500);
  }
};

function inputErrors({ email, password, reason }) {
  const errors = [];
  if (!email) errors.push("Email is required");
  if (!password) errors.push("Password is required");
  if (!reason) errors.push("Reason for login is required");
  return errors;
}

module.exports = { login };
