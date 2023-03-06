const express = require("express");
const { validateToken } = require("../Auth/jwt");

const {
  addUser,
  getUsers,
  deleteUser,
  updateUser,
  loginUser,
} = require("../Controllers/userControllers");
const router = express.Router();
router.route("/").post(validateToken, addUser);
router.route("/:id").get(validateToken, getUsers);
router.route("/").get(validateToken, getUsers);
router.route("/:id").delete(validateToken, deleteUser);
router.route("/:id").patch(validateToken, updateUser);
router.route("/login").post(loginUser);
module.exports = router;
