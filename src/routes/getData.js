const Courses = require("../models/courses");
const Notifications = require("../models/notifications");
const staffPipeline = require("../models/pipelines/staffPipeline");
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

    // get notifications
    const notificationsData = await Notifications.find({ user: id });
    data.notifications = notificationsData.map((notification) =>
      notification.toObject(),
    );

    if (userData.role === "admin" || userData.role === "viewer") {
      // get courses
      const coursesData = await Courses.find({ school: userData.school });
      data.courses = coursesData.map((course) => course.toObject());

      // get lecturers
      const staffsData = (await Users.aggregate(staffPipeline)).map((staff) => {
        staff.experience = staff.experience.pop();
        staff.education = staff.education.pop();
        staff.catalog = staff.catalog.pop();
        return staff;
      });
      data.staffs = staffsData;
    }

    if (userData.role === "staff" || userData.role === "viewer") {
      // get portfolio
      const professionalData = await Professionals.findOne({ user: id });
      data.professional = professionalData?.toObject();

      // get assigned courses
      const coursesData = await Courses.find({ assignedTo: id });
      data.assignedCourses = coursesData.map((course) => course.toObject());
    }

    return success("User data retrieved successfully", data);
  } catch (error) {
    console.log(error.message);
    return failed("Internal server error", "Internal server error", 500);
  }
};

module.exports = { getData };
