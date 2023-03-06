const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../Config/database");
const Cities = require("./cities");
const Users = require("./users");

//The below Addresses model is equivalent to creating a table with Below Columns
// CREATE TABLE addresses (
//   add_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
//   address_line1 VARCHAR(255) NOT NULL,
//   address_line2 VARCHAR(255) NOT NULL,
//   landmark VARCHAR(20) NOT NULL,
//   zip_code VARCHAR(6) NOT NULL,
//   u_id INT NOT NULL,
//   city_id INT NOT NULL,
//   FOREIGN KEY (u_id) REFERENCES users(u_id),
//   FOREIGN KEY (city_id) REFERENCES cities(city_id)
// );

const Addresses = sequelize.define("addresses", {
  add_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  address_line1: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  address_line2: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  landmark: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  zip_code: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
});
//Defining the foreign keys.
//Here we do not have to create fields for these relations as sequelize automatically created the concerned columns.
//Also we have to import the models from which the foreign key is being used here
Addresses.belongsTo(Users, { foreignKey: { allowNull: false } });
Addresses.belongsTo(Cities, { foreignKey: { allowNull: false } });
//Exporting the module
module.exports = Addresses;
