const Messages = require("../models/messages");
const Users = require("../models/users");
const Response = require("../utils/response");

const createMessage = async (req, res) => {
  const { success, failed } = new Response(res);
  const id = req.data.id;
  const message = req.body.message;
  const category = req.body.category;

  try {
    const sender = await Users.findOne({ _id: id });
    const receiver = await Users.findOne({
      school: sender.school,
      role: "admin",
    });

    if (!receiver)
      return failed("Message not sent", "No admin found for this school");

    const newMessage = new Messages({
      sender: id,
      receiver: receiver._id,
      message,
      category,
    });
    await newMessage.save();
    success("Message sent", {});
  } catch (err) {
    if (err.name === "ValidationError") {
      return failed("Message not sent", err.message);
    }
    failed("Message not sent", "An error occurred");
  }
};

module.exports = { createMessage };
