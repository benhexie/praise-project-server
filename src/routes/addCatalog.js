const Response = require("../utils/response");

const addCatalog = async (req, res) => {
    const { success, failed } = new Response(res);
};

module.exports = { addCatalog };
