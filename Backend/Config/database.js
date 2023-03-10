//Creating a sequelize instance and defining our database credentials name, database, password

const Sequelize = require("sequelize");
const sequelize = new Sequelize("umsv2", "postgres", "IceMan1510", {
  host: "localhost",
  dialect: "postgresql",
  logging: false,
});
module.exports = sequelize;
