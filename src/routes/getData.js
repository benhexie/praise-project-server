const Users = require("../models/users");
const Response = require("../utils/response");

const getData = async (req, res) => {
    const { success, failed } = new Response(res);
    const id = req.data.id;

    const data = {}
    try {
        // get user
        const userData = await Users.findOne({ _id: id }, { password: 0 });
        if (!userData) return failed("User not found", "User not found", 404);
        data.user = userData.toObject();

        return success("User data", data);
    } catch (error) {
        console.log(error.message);
        return failed("Internal server error", "Internal server error", 500);
    }
}

module.exports = { getData };