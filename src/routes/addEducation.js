const Professionals = require("../models/professionals");
const Users = require("../models/users");
const Response = require("../utils/response");

const addEducation = async (req, res) => {
  const { success, failed } = new Response(res);
  const id = req.data.id;
  const school = req.body.school;
  const degree = req.body.degree || null;
  const field = req.body.field || null;
  const description = req.body.description || null;
  const from = req.body.from;
  const to = req.body.to || null;
  const current = req.body.current || false;

  const error = validateEducation(req);
  if (error) return failed("Education not added", error);

  try {
    const education = {
      school,
      degree,
      field,
      description,
      from,
      to,
      current,
    };

    if (!(await Users.findOne({ _id: id })))
      return failed("Education not added", "User not found", 404);

    const professionalData = await Professionals.findOneAndUpdate(
      { user: id },
      { $push: { education } },
      { new: true, upsert: true }
    );

    return success("Education added successfully", professionalData.education);
  } catch (error) {
    console.log(error.message);
    return failed("Internal server error", "Internal server error", 500);
  }
};

function validateEducation(req) {
  const school = req.body.school;
  const from = req.body.from;
  const to = req.body.to;
  const current = req.body.current;

  if (!school) return "School is required";
  if (!from) return "From is required";
  if (!current && !to) return "To is required";
  return false;
}

module.exports = { addEducation };
