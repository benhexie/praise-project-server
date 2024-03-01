const Courses = require("../models/courses");
const Users = require("../models/users");
const createNotification = require("../utils/createNotification");
const Response = require("../utils/response");

const addCourse = async (req, res) => {
  const { failed, success } = new Response(res);
  const code = req.body.code.replace(/ +/, "");
  const title = req.body.title;
  const description = req.body.description || null;
  const credits = req.body.credits;
  const assignedTo = req.body.assignedTo || null;
  const id = req.data.id;

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

    const course = new Courses(courseData);
    const newCourse = await course.save();

    if (assignedTo)
      await createNotification({
        message: `You have been assigned to ${code}`,
        user: assignedTo,
      });

    return success("Course added", newCourse);
  } catch (error) {
    console.error(error.message);
    return failed("Internal server error", "Internal server error", 500);
  }
};

module.exports = { addCourse };
