const Users = require("../models/users");
const { initializeApp } = require("firebase/app");
const firebaseConfig = require("../../firebaseConfig");
const {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} = require("firebase/auth");
const Response = require("../utils/response");
const Schools = require("../models/schools");

const app = initializeApp(firebaseConfig);

const signup = async (req, res) => {
  const { success, failed } = new Response(res);
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  let role = req.body.role;
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.school;
  let school = req.body.school;
  const address = req.body.address;
  let token = req.body.token;

  const errors = inputErrors(req.body);
  if (!errors.length) return failed("Signup failed", errors.join("\n"));

  if (role === "school") {
    const schoolData = await Schools.create({
      name,
      address,
      email,
    });
    token = schoolData.token;
    school = schoolData._id;
  }

  role = role === "school" ? "admin" : "user";
  const auth = getAuth(app);
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    await Users.create({
      email,
      firstname,
      lastname,
      username,
      role,
      school,
      token,
    });
    await sendEmailVerification(auth.currentUser);
    success("Please check your email for verification", {});
  } catch (err) {
    failed("Signup failed", err.message);
  }
};

function inputErrors({
  firstname,
  lastname,
  email,
  role,
  password,
  token,
  school,
}) {
  let errors = [];
  if (!firstname) errors.push("First name is required.");
  if (firstname && !new RegExp(/^[a-zA-Z]+$/).test(firstname))
    errors.push("First name is invalid.");
  if (!lastname) errors.push("Last name is required.");
  if (lastname && !new RegExp(/^[a-zA-Z]+$/).test(lastname))
    errors.push("Last name is invalid.");
  if (!email) errors.push("Email is required.");
  if (
    email &&
    !new RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-z]+$/).test(email)
  )
    errors.push("Email is invalid.");
  if (!role) errors.push("Role is required.");
  if (role && ["teacher", "school"].includes(role) === false)
    errors.push("Role is invalid.");
  if (!password) errors.push("Password is required.");
  if (password && password.length < 8)
    errors.push("Password must be at least 8 characters.");
  if (!confirm) errors.push("Confirm password is required.");
  if (password !== confirm) errors.push("Password does not match.");
  if (role === "teacher" && !school) errors.push("School is required.");
  if (role === "teacher" && !token) errors.push("Token is required.");
  if (role === "school" && !school) errors.push("School is required.");
  if (role === "school" && !address) errors.push("Address is required.");
  return errors;
}

module.exports = { signup };
