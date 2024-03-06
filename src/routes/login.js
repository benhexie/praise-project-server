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
  const auth = getAuth(app);

  const errors = inputErrors({ email, password });
  if (errors.length) return failed("Login failed", errors.join("\n"));

  try {
    const userData = await Users.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    if (!userData) return failed("User not found", "User not found", 404);

    const userCredential = await signInWithEmailAndPassword(
      auth,
      userData.email,
      password,
    );
    const user = userCredential.user;
    if (!user.emailVerified)
      return failed("Login failed", "Please verify your email", 400);

    await Users.updateOne({ _id: userData._id }, { lastLogin: Date.now() });
    return success("User logged in", {
      token: genToken({ id: userData._id }),
    });
  } catch (error) {
    console.log(error.message);
    if (error.code === "auth/wrong-password")
      return failed("Login failed", "Wrong password", 400);
    if (error.code === "auth/invalid-credential")
      return failed("Login failed", "Incorrect email or password", 400);
    if (error.code === "auth/user-not-found")
      return failed("Login failed", "User not found", 404);
    if (error.code === "auth/invalid-email")
      return failed("Login failed", "Invalid email", 400);
    if (error.code === "auth/too-many-requests")
      return failed("Login failed", "Too may attempts. Try again later", 400);
    return failed("Internal server error", "Internal server error", 500);
  }
};

function inputErrors({ email, password }) {
  const errors = [];
  if (!email) errors.push("Email is required");
  if (!password) errors.push("Password is required");
  return errors;
}

module.exports = { login };
