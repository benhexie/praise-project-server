const Response = require("../utils/response");
const Messages = require("../models/messages");

const getMessages = async (req, res) => {
  const { success, failed } = new Response(res);
  const id = req.data.id;

  try {
    const messages = await Messages.find({ receiver: id })
      .populate({
        path: "sender",
        select: "email",
      })
      .sort({ createdAt: -1 })
      .exec();
    success("Messages retrieved", messages);
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError")
      return failed("Messages not retrieved", err.message);
    failed("Messages not retrieved", "An error occurred");
  }
};

module.exports = { getMessages };
