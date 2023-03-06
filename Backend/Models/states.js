const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../Config/database");
//The below States model is equivalent to creating a table with Below Columns
// CREATE TABLE ums.states (
//   state_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
//   state_name VARCHAR(50) NOT NULL
// );

const States = sequelize.define("states", {
  state_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  state_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
});
//Exporting the module
module.exports = States;
