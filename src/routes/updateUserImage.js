const firebaseConfig = require("../../firebaseConfig");
const Users = require("../models/users");
const Response = require("../utils/response");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytes,
} = require("firebase/storage");

const app = initializeApp(firebaseConfig);

const updateUserImage = async (req, res) => {
  const { success, failed } = new Response(res);
  const id = req.data.id;
  const image = req.file;

  if (!image) return failed("Image not updated", "Image not found");

  const storage = getStorage(app);
  const storageRef = ref(storage, `users/${image.originalname}`);
  const snapshot = await uploadBytes(storageRef, image.buffer);
  const url = await getDownloadURL(snapshot.ref);

  const user = await Users.findByIdAndUpdate(id, { image: url }, { new: true });

  if (!user) return failed("Image not updated", "User not found");
  return success("Image updated", user.toObject());
};

module.exports = { updateUserImage };
