const Professionals = require("../models/professionals");
const Users = require("../models/users");
const Response = require("../utils/response");

const addExperience = async (req, res) => {
  const { success, failed } = new Response(res);
  const id = req.data.id;
  const company = req.body.company;
  const title = req.body.title;
  const location = req.body.location || null;
  const description = req.body.description || null;
  const from = req.body.from;
  const to = req.body.to || null;
  const current = req.body.current || false;

  const error = validateExperience(req);
  if (error) return failed("Experience not added", error);

  try {
    if (!(await Users.findOne({ _id: id })))
      return failed("Experience not added", "User not found", 404);

    const experience = {
      company,
      title,
      location,
      description,
      from,
      to,
      current,
    };

    if (!(await Users.findOne({ _id: id })))
      return failed("Education not added", "User not found", 404);

    const professionalData = await Professionals.findOneAndUpdate(
      { user: id },
      { $push: { experience } },
      { new: true, upsert: true },
    );

    return success(
      "Experience added successfully",
      professionalData.experience
    );
  } catch (error) {
    console.log(error.message);
    return failed("Internal server error", "Internal server error", 500);
  }
};

function validateExperience(req) {
  const company = req.body.company;
  const title = req.body.title;
  const from = req.body.from;
  const to = req.body.to;
  const current = req.body.current;

  if (!company) return "Company is required";
  if (!title) return "Title is required";
  if (!from) return "From is required";
  if (!current && !to) return "To is required";
  return false;
}

module.exports = { addExperience };
