const Response = require("../utils/response");
const Users = require("../models/users");
const Courses = require("../models/courses");
const createNotification = require("../utils/createNotification");

const updateCourse = async (req, res) => {
  const { failed, success } = new Response(res);
  const id = req.data.id;
  const code = req.body.code.replace(/ +/, "");
  const title = req.body.title;
  const description = req.body.description || null;
  const credits = req.body.credits;
  const assignedTo = req.body.assignedTo || null;

  try {
    const userData = await Users.findOne({ _id: id }, { school: 1 });
    if (!userData) return failed("User not found", "User not found", 404);
    const school = userData.school;

    const courseData = {
      school,
      code,
      title,
      credits,
      description,
      assignedTo,
    };

    const course = await Courses.findOneAndUpdate(
      { school, code },
      courseData,
      { new: true },
    );

    if (assignedTo)
      await createNotification({
        message: `You have been assigned to ${code}`,
        user: assignedTo,
      });

    if (!course) return failed("Course not found", "Course not found", 404);
    return success("Course updated", course, 200);
  } catch (error) {
    console.error(error.message);
    return failed("Internal server error", "Internal server error", 500);
  }
};

module.exports = { updateCourse };
