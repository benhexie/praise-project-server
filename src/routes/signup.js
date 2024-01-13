const userModel = require("../models/users");
const { initializeApp } = require("firebase/app");
const firebaseConfig = require("../../firebaseConfig");
const {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} = require("firebase/auth");
const Response = require("../utils/response");

const app = initializeApp(firebaseConfig);

const signup = async (req, res) => {
  const { success, failed } = new Response(res);
  const email = req.body.email;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const role = req.body.role;

  if (!email || !password || !firstname || !lastname || !role) {
    return failed("Signup failed", "All fields are required");
  }

  if (!/^[a-zA-Z]+$/.test(firstname) || !/^[a-zA-Z]+$/.test(lastname)) {
    return failed(
      "Signup failed",
      "Firstname and lastname must contain only letters"
    );
  }

  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return failed(
      "Signup failed",
      "Username must contain only letters and numbers"
    );
  }

  if (!/^[0-9]+$/.test(phone)) {
    return failed("Signup failed", "Phone must contain only numbers");
  }

  const user = new userModel({ email, firstname, lastname, username, phone });
  const auth = getAuth(app);
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    await user.save();
    await sendEmailVerification(auth.currentUser);
    success("Please check your email for verification", {});
  } catch (err) {
    failed("Signup failed", err.message);
  }
};

module.exports = { signup };
