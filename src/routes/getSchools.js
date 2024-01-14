const Schools = require("../models/schools");
const Response = require("../utils/response");

const getSchools = async (req, res) => {
    const { success, failed } = new Response(res);

    try {
        const schools = await Schools.find({}, { name: 1 });
        return success("Schools data", schools);
    } catch (error) {
        console.log(error.message);
        return failed("Internal server error", "Internal server error", 500);
    }
}

module.exports = { getSchools };