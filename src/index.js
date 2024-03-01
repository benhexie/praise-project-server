require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const { signup } = require("./routes/signup");
const { login } = require("./routes/login");
const { authToken } = require("./middleware/authToken");
const { getData } = require("./routes/getData");
const { getSchools } = require("./routes/getSchools");
const { changeToken } = require("./routes/changeToken");
const { addExperience } = require("./routes/addExperience");
const { addEducation } = require("./routes/addEducation");
const { addCatalog } = require("./routes/addCatalog");
const { updateUser } = require("./routes/updateUser");
const { addCourse } = require("./routes/addCourse");
const { updateUserImage } = require("./routes/updateUserImage");
const verifyAdmin = require("./middleware/verifyAdmin");
const { updateCourse } = require("./routes/updateCourse");
const { forgotPassword } = require("./routes/forgotPassword");
const { disableUser } = require("./routes/disableUser");
const { deleteCourse } = require("./routes/deleteCourse");
const { readNotifications } = require("./routes/readNotifications");

const app = express();
const PORT = process.env.PORT || 3000;
require("./models/connection");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET
app.get("/", (req, res) => {
  res.redirect("https://praise-project.vercel.app/");
});
app.get("/data", authToken, getData);
app.get("/schools", getSchools);
app.get("/token", authToken, changeToken);

// POST
app.post("/auth/signup", signup);
app.post("/auth/login", login);
app.post("/auth/forgot-password", forgotPassword);
app.post("/api/profile/experience", authToken, addExperience);
app.post("/api/profile/education", authToken, addEducation);
app.post("/api/profile/catalog", upload.single("image"), authToken, addCatalog);
app.post("/course", authToken, verifyAdmin, addCourse);

// PUT
app.put("/user", authToken, updateUser);
app.put("/course", authToken, verifyAdmin, updateCourse);

// PATCH
app.patch("/user/image", upload.single("image"), authToken, updateUserImage);
app.patch("/user/:id", authToken, verifyAdmin, disableUser);
app.patch("/notifications", authToken, readNotifications);

// DELETE
app.delete("/course/:id", authToken, verifyAdmin, deleteCourse);

const listener = app.listen(PORT, () => {
  console.log(`Server is running on port ${listener.address().port}`);
});
