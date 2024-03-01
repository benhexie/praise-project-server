const Courses = require("../models/courses");
const Response = require("../utils/response");

const deleteCourse = async (req, res) => {
  const { success, failed } = new Response(res);
  const { id } = req.params;

  try {
    const deleted = await Courses.findByIdAndDelete(id);
    if (!deleted) return failed("Course not deleted", "Course not found");
    success("Course deleted", deleted);
  } catch (err) {
    console.error(err.message);
    if (err.name === "CastError")
      return failed("Course not deleted", "Invalid course");
    failed("Course not deleted", "Something went wrong");
  }
};

module.exports = { deleteCourse };
