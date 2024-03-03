const Messages = require("../models/messages");
const Response = require("../utils/response");

const readMessage = async (req, res) => {
  const { success, failed } = new Response(res);
  const id = req.data.id;
  const messageId = req.params.id;
  const read = req.body.read;

  try {
    const messages = await Messages.findByIdAndUpdate(
      { _id: messageId, receiver: id },
      { read },
      { new: true },
    )
      .populate({
        path: "sender",
        select: "email",
      })
      .exec();
    success("Messages retrieved", messages);
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError")
      return failed("Messages not retrieved", err.message);
    failed("Messages not retrieved", "An error occurred");
  }
};

module.exports = { readMessage };
