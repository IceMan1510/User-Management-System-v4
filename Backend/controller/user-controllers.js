const bcrypt = require("bcrypt");
const validator = require("validator");
const { createAccessTokens } = require("../auth/jwt");
const BlackTokens = require("../models/blacktokens");
const {
  getAllUsersService,
  getSingleUserService,
  deleteUserService,
  updateUserService,
  createUserService,
  logInUserService,
  logOutUserService,
} = require("../services/user-services");
const {
  checkRole,
  checkRoleById,
  checkRoleByEmail,
} = require("../util/check-role");
const { isEmailExists } = require("../util/is-email-exists");

let checkPwd = (str) => {
  if (
    str.length < 8 ||
    str.length > 255 ||
    str.search(/\d/) == -1 ||
    str.search(/[a-zA-Z]/) == -1 ||
    str.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\.\,\;\:]/) != -1
  ) {
    return false;
  } else {
    return true;
  }
};
var validateContactNumber = (input) => {
  const regex = /^\d{10}$/;
  return regex.test(input);
};
var isZipNumber = (zip) => {
  if (isNaN(zip)) {
    return false;
  }

  if (zip.toString().length !== 6) {
    return false;
  }

  return true;
};

var checkDate = (date) => {
  if (
    new Date(date).getFullYear() < 1970 ||
    new Date(date).getFullYear() > 2005 ||
    date === "Select Date" ||
    date === ""
  ) {
    return false;
  } else {
    return true;
  }
};
var allValidForUpdate = (user) => {
  if (
    user.f_name.trim() === "" ||
    !validator.isAlpha(user.l_name) ||
    !validator.isAlpha(user.m_name) ||
    user.l_name.trim() === "" ||
    !validator.isEmail(user.email) ||
    !validator.isAlpha(user.f_name) ||
    user.contact.trim() === "" ||
    user.contact.trim().length !== 10 ||
    user.address_line1.trim() === "" ||
    user.date_of_birth.trim() === "" ||
    user.contact.trim() === "" ||
    !checkDate(user.date_of_birth) ||
    !validateContactNumber(user.contact) ||
    !isZipNumber(user.zip_code) ||
    user.address_line1.trim() === "" ||
    user.address_line2.trim() === "" ||
    user.state_name === "Select State" ||
    user.city_name.trim() === "" ||
    user.landmark.trim() === ""
  ) {
    return true;
  } else {
    return false;
  }
};
var allValid = (user) => {
  if (
    user.f_name.trim() === "" ||
    !validator.isAlpha(user.l_name) ||
    !validator.isAlpha(user.m_name) ||
    user.l_name.trim() === "" ||
    !validator.isEmail(user.email) ||
    !validator.isAlpha(user.f_name) ||
    user.contact.trim() === "" ||
    user.contact.trim().length !== 10 ||
    user.password.trim() === "" ||
    user.address_line1.trim() === "" ||
    user.date_of_birth.trim() === "" ||
    user.contact.trim() === "" ||
    !checkPwd(user.password) ||
    !checkDate(user.date_of_birth) ||
    !validateContactNumber(user.contact) ||
    !isZipNumber(user.zip_code) ||
    user.address_line1.trim() === "" ||
    user.address_line2.trim() === "" ||
    user.state_name === "Select State" ||
    user.city_name.trim() === "" ||
    user.landmark.trim() === ""
  ) {
    return true;
  } else {
    return false;
  }
};

exports.getUsers = async (req, res) => {
  try {
    const params = req.params;
    if (JSON.stringify(params) === "{}") {
      var page = req.query.page;
      var limit = req.query.limit;
      var serviceResponse = await getAllUsersService(page, limit);
      res.status(200).send(serviceResponse);
    } else {
      var serviceResponse = await getSingleUserService(params.id);
      if (serviceResponse.length === 0) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.status(200).send(serviceResponse);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    var role = await checkRoleByEmail(res.locals.email);
    const id = req.id;
    if (role !== "admin" || role === undefined || role === "") {
      res.status(401).send(`Not authorized`);
    } else {
      const result = await deleteUserService(id);
      if (result) {
        res
          .status(200)
          .send({ message: `User with ID ${id} deleted successfully` });
      } else {
        res.status(404).send(`No user found with ID ${id}`);
      }
    }
  } catch (error) {
    res.status(500).send(`Internal Server Error`);
    console.log(error);
  }
};

exports.updateUser = async (req, res) => {
  try {
    var role = await checkRoleByEmail(res.locals.email);
    const body = req.body;
    const id = req.params.id;
    if (role !== "admin" || role === undefined || role === "") {
      res.status(401).send(`Not authorized`);
    } else if (allValidForUpdate(body)) {
      return res.status(404).send(`Enter valid data`);
    } else if (body.password === "" && body.confirmPassword === "") {
      body.password = body.passForVerification;
      const result = await updateUserService(id, body);
      if (!result) {
        return res.status(404).send(`No user found with ID ${id}`);
      } else {
        return res.send(`User with ID ${id} updated successfully`);
      }
    } else if (!bcrypt.compareSync(body.password, body.passForVerification)) {
      return res.status(400).send(`Old Password Doesn't Match`);
    } else if (!checkPwd(body.confirmPassword)) {
      return res.status(400).send(`New Password Doesn't Match The Parameter`);
    } else {
      const hash = bcrypt.hashSync(body.confirmPassword, 10);
      body.password = hash;
      const result = await updateUserService(id, body);
      if (!result) {
        return res.status(404).send(`No user found with ID ${id}`);
      } else {
        return res.send(`User with ID ${id} updated successfully`);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.addUser = async (req, res) => {
  try {
    const user = req.body;
    var role = await checkRoleByEmail(res.locals.email);
    var isEmailExists = await isEmailExists(user.email);
    if (role !== "admin" || role === undefined || role === "") {
      res.status(401).send(`Not authorized`);
    } else if (allValid(user)) {
      res.status(400).send("Please enter appropriate data");
    } else if (isEmailExists === user.email) {
      res.status(400).send("Email already exists");
    } else {
      var serviceResponse = await createUserService(user);
      res.status(200).send(`Thank you for registration ${user.f_name}`);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};
exports.loginUser = async (req, res) => {
  try {
    if (
      req.body.email.trim().length === 0 ||
      req.body.password.trim().length === 0
    ) {
      res
        .status(401)
        .send({ accessToken: null, Response: "Email Or Password Mismatch" });
    } else {
      const result = await logInUserService(req.body);
      if (result.success) {
        const accessToken = createAccessTokens(req.body);
        const response = {
          accessToken: accessToken,
          payload: await result.payload,
          Response: "Successfully Logged In",
        };
        res.status(200).send(response);
      } else {
        res.status(401).send({ Response: "Failed To Log In" });
      }
    }
  } catch (error) {
    res.status(500).send({ Response: "Internal Server Error" });
  }
};

exports.logOut = async (req, res) => {
  try {
    const result = logOutUserService(req.body);
    if (result) {
      res.status(200).send("Successfully logged out");
    } else {
      res.status(404).send("Not Found");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
