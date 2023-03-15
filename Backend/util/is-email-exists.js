const Users = require("../models/users");

exports.isEmailExists = async (email) => {
  let isEmailExists = await Users.findAll({ where: { email: `${email}` } });
  return isEmailExists[0].email;
};
