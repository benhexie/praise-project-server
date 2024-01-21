const { initializeApp } = require("firebase/app");
const {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytes,
} = require("firebase/storage");
const Professionals = require("../models/professionals");
const Users = require("../models/users");
const Response = require("../utils/response");
const firebaseConfig = require("../../firebaseConfig");

const app = initializeApp(firebaseConfig);

const addCatalog = async (req, res) => {
  const { success, failed } = new Response(res);
  const id = req.data.id;
  const type = req.body.type;
  const name = req.body.name;
  const description = req.body.description || null;
  const links = JSON.parse(req.body.links || "[]");
  let image = req.file || null;
  const from = req.body.from;
  const to = req.body.to || null;
  const current = req.body.current || false;

  const error = validateCatalog(req);
  if (error) return failed("Catalog not added", error);

  try {
    const catalog = {
      type,
      name,
      description,
      links,
      from,
      to,
      current,
    };

    if (!(await Users.findOne({ _id: id })))
      return failed("Education not added", "User not found", 404);

    if (image) {
      const storage = getStorage(app);
      const storageRef = ref(storage, `catalog/${image.originalname}`);
      const snapshot = await uploadBytes(storageRef, image.buffer);
      const url = await getDownloadURL(snapshot.ref);
      catalog.image = url;
    } else {
      catalog.image = null;
    }

    const professionalData = await Professionals.findOneAndUpdate(
      { user: id },
      { $push: { catalog } },
      { new: true, upsert: true }
    );

    return success("Catalog added successfully", professionalData.catalog);
  } catch (error) {
    console.log(error.message);
    return failed("Internal server error", "Internal server error", 500);
  }
};

function validateCatalog(req) {
  const type = req.body.type;
  const name = req.body.name;
  const from = req.body.from;
  const to = req.body.to;
  const current = req.body.current;

  const allowedTypes = ["project", "publication", "patent"];
  if (!type) return "Type is required";
  if (!allowedTypes.includes(type))
    return "Type must be one of project, publication or patent";
  if (!name) return "Name is required";
  if (!from) return "From is required";
  if (!current && !to) return "To is required";
  return false;
}

module.exports = { addCatalog };
