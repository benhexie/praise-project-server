const Response = require("../utils/response");
const Professional = require("../models/professionals");

const deletePortfolioItem = async (req, res) => {
  const { success, failed } = new Response(res);
  const id = req.data.id;
  const category = req.params.category;
  const itemId = req.params.id;

  try {
    const items = await Professional.findOne({ user: id });
    if (!items)
      return failed(
        "Item not deleted",
        "User does not exist or has no records",
        404,
      );

    const updatedCategory = items[category].filter(
      (item) => item._id.toString() !== itemId,
    );

    items[category] = updatedCategory;
    await items.save();
    success("Item deleted", {});
  } catch (error) {
    console.error(error.message);
    failed("Item not deleted", "An error occurred", 500);
  }
};

module.exports = { deletePortfolioItem };
