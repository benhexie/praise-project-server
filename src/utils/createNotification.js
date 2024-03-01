const Notifications = require("../models/notifications");

const createNotification = async ({ message, user }) => {
  if (!message || !user) return;
  const notification = new Notifications({ message, user });
  try {
    await notification.save();
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = createNotification;
