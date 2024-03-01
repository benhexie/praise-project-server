const Notifications = require("../models/notifications");
const Response = require("../utils/response");

const readNotifications = async (req, res) => {
  const { failed, success } = new Response(res);
  const id = req.data.id;

  try {
    const notifications = await Notifications.updateMany(
      { user: id },
      { read: true },
    );
    return success("Notifications read", {});
  } catch (error) {
    console.error(error.message);
    return failed("Internal server error", "Internal server error", 500);
  }
};

module.exports = { readNotifications };
