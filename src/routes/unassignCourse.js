const Response = require("../utils/response");
const Courses = require("../models/courses");

const unassignCourse = async (req, res) => {
  const { success, failed } = new Response(res);
  const { id } = req.params;

  try {
    const course = await Courses.updateOne({ _id: id }, { assignedTo: null });
    if (!course) return failed("Course not found", "Course not found", 404);
    return success("Course unassigned", course);
  } catch (error) {
    console.log(error.message);
    return failed("Internal server error", "Internal server error", 500);
  }
};

module.exports = { unassignCourse };
