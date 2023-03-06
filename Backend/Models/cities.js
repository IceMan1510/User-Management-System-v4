const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../Config/database");
const States = require("./states");

//The below Cities model is equivalent to creating a table with Below Columns
//   CREATE TABLE cities (
//   city_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
//   city_name VARCHAR(50) NOT NULL,
//   state_id INT NOT NULL,
//   FOREIGN KEY (state_id) REFERENCES states(state_id)
// );

const Cities = sequelize.define("cities", {
  city_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  city_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
});

//Defining the foreign keys.
//Here we do not have to create fields for these relations as sequelize automatically created the concerned columns.
//Also we have to import the models from which the foreign key is being used here
Cities.belongsTo(States, { foreignKey: { allowNull: false } });

module.exports = Cities;
