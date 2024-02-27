const Courses = require("../models/courses");
const Professionals = require("../models/professionals");
const Schools = require("../models/schools");
const Users = require("../models/users");
const Response = require("../utils/response");

const getData = async (req, res) => {
  const { success, failed } = new Response(res);
  const id = req.data.id;

  const data = {};
  try {
    // get user
    const userData = await Users.findOne({ _id: id }, { password: 0 });
    if (!userData) return failed("User not found", "User not found", 404);
    data.user = userData.toObject();

    // get school
    const schoolData = await Schools.findOne({ _id: userData.school });
    if (!schoolData) return failed("School not found", "School not found", 404);
    data.school = schoolData.toObject();

    if (userData.role === "admin") {
      // get courses
      const coursesData = await Courses.find({ school: userData.school });
      data.courses = coursesData.map((course) => course.toObject());

      // get lecturers
      const lecturersData = await Users.find({
        school: userData.school,
        role: "user",
      });
      data.lecturers = lecturersData.map((lecturer) => lecturer.toObject());
    }

    if (userData.role === "user") {
      // get portfolio
      const professionalData = await Professionals.findOne({ user: id });
      data.professional = professionalData?.toObject() || {};

      // get assigned courses
      const coursesData = await Courses.find({ assignedTo: id });
      data.courses = coursesData.map((course) => course.toObject());
    }

    return success("User data retrieved successfully", data);
  } catch (error) {
    console.log(error.message);
    return failed("Internal server error", "Internal server error", 500);
  }
};

module.exports = { getData };
