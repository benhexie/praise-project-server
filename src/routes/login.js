const Response = require("../utils/response");
const { initializeApp } = require("firebase/app");
const firebaseConfig = require(`${__dirname}/../../firebaseConfig`);
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { genToken } = require("../utils/genToken");
const userModel = require("../models/users");

const app = initializeApp(firebaseConfig);

const login = async (req, res) => {
  const { success, failed } = new Response(res);
  const email = req.body.email?.trim();
  const password = req.body.password;
  const auth = getAuth(app);

  try {
    // use regex to check if email is valid
    const userData = await userModel.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    if (!userData) {
      return failed("User not found", "User not found", 404);
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      userData.email,
      password
    );
    const user = userCredential.user;
    if (!user.emailVerified) {
      failed("Login failed", "Please verify your email", 400);
      return;
    }

    await userModel.updateOne(
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

module.exports = { login };
