const bcrypt = require("bcrypt");
const validator = require("validator");
const { createTokens } = require("../Auth/jwt");

const {
  getAllUsersService,
  getSingleUserService,
  deleteUserService,
  updateUserService,
  createUserService,
  logInUserService,
} = require("../Services/userServices");

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
      var serviceResponse = await getAllUsersService(page);
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
    const id = req.params.id;
    const result = await deleteUserService(id);
    if (result) {
      res
        .status(200)
        .send({ message: `User with ID ${id} deleted successfully` });
    } else {
      res.status(404).send(`No user found with ID ${id}`);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    const id = req.params.id;
    if (allValidForUpdate(body)) {
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

    if (allValid(user)) {
      res.status(400).send("Please enter appropriate data");
    } else {
      var serviceResponse = await createUserService(user);
      if (serviceResponse.success === false) {
        res.status(400).send(serviceResponse.body);
      } else {
        res.status(200).send(serviceResponse.body);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};
exports.loginUser = async (req, res) => {
  if (req.body.email.trim() === "" || req.body.password.trim() === "") {
    res
      .status(401)
      .send({ accessToken: null, Response: "Email Or Password Mismatch" });
  } else {
    const result = await logInUserService(req.body);
    console.log(result);
    if (result.success) {
      const accessToken = createTokens(req.body);
      // res
      //   .cookie("access-token", accessToken, {
      //     maxAge: 36000000,
      //     httpOnly: true,
      //   })
      //   .status(200)
      //   .json("Logged In Successfully");
      res.status(200).send({
        accessToken: accessToken,
        payload: await result.payload,
        Response: "Successfully Logged In",
      });
    } else {
      res.status(401).send({ Response: "Failed To Log In" });
    }
  }
};
