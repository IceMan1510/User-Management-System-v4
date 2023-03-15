const Users = require("../models/users");

exports.checkRoleByEmail = async (email) => {
  let checkRole = await Users.findAll({ where: { email: `${email}` } });
  return checkRole[0].role;
};
