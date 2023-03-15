const express = require("express");
const { validateToken } = require("../auth/jwt");
const {
  addUser,
  getUsers,
  deleteUser,
  updateUser,
  loginUser,
  logOut,
} = require("../controller/user-controllers");
const router = express.Router();
router.route("/").post(validateToken, addUser);
router.route("/:id").get(validateToken, getUsers);
router.route("/").get(validateToken, getUsers);
router.route("/:id").delete(validateToken, deleteUser);
router.route("/:id").patch(validateToken, updateUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logOut);
module.exports = router;
