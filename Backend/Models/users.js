const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../Config/database");
//The below Users model is equivalent to creating a table with Below Columns
// CREATE TABLE users (u_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, f_name VARCHAR(20) NOT NULL,
// m_name VARCHAR(20) NOT NULL, l_name VARCHAR(20) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE,
// contact VARCHAR(10) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, date_of_birth DATE NOT NULL,
// gender gender default 'Other' not null, Del isdeleted DEFAULT '0');
//Also it internally creates the enum types
const Users = sequelize.define("users", {
  u_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  f_name: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  m_name: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  l_name: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  contact: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM("Male", "Female", "Other"),
    defaultValue: "Other",
    allowNull: false,
  },
  del: {
    type: DataTypes.ENUM("0", "1"),
    defaultValue: "0",
    allowNull: false,
  },
});
//Exporting the module
module.exports = Users;
