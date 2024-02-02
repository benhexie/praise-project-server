const Users = require("../models/users");
const Response = require("../utils/response");

const updateUser = async (req, res) => {
  const { success, failed } = new Response(res);
  const id = req.data.id;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  let age = req.body.age;
  const origin = req.body.origin;
  const nationality = req.body.nationality;
  let phone = req.body.phone;
  if (phone) phone = phone.replace(/\s/g, "");

  const errors = validateInput(firstname, lastname, age, phone);
  if (errors.length > 0) return failed("Invalid input", errors.join(", "));

  const update = {};
  if (firstname) update.firstname = firstname;
  if (lastname) update.lastname = lastname;
  if (age) update.age = age;
  if (origin) update.origin = origin;
  if (nationality) update.nationality = nationality;
  if (phone) update.phone = phone;

  try {
    const user = await Users.findByIdAndUpdate(id, update, { new: true });
    if (!user) return failed("Invalid input", "User not found");
    delete user.password;
    return success("User updated", user.toObject());
  } catch (error) {
    console.log(error.message);
    if (error.name === "CastError")
      return failed("Invalid input", "User not found");
    return failed("Internal server error", "Internal server error", 500);
  }
};

module.exports = { updateUser };

function validateInput(firstname, lastname, age, phone) {
  const errors = [];
  if (!firstname || !lastname)
    errors.push("Firstname and lastname are required");
  if (age && isNaN(age)) errors.push("Age must be a number");
  if (phone && !phone.match(/^\+?\d+$/)) errors.push("Invalid phone number");
  return errors;
}
