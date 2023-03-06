const { DataTypes } = require('sequelize');
const sequelize = require('<your sequelize instance>');

const User = sequelize.define('users', {
  u_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  f_name: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  m_name: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  l_name: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  contact: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    defaultValue: 'Other',
    allowNull: false
  },
  isdeleted: {
    type: DataTypes.ENUM('0', '1'),
    defaultValue: '0',
    allowNull: false
  }
});

module.exports = User;



const { DataTypes } = require('sequelize');
const sequelize = require('<your sequelize instance>');

const States = sequelize.define('states', {
  state_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  state_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
});

module.exports = State;





const { DataTypes } = require('sequelize');
const sequelize = require('<your sequelize instance>');

const City = sequelize.define('cities', {
  city_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  city_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
});

module.exports = City;


const { DataTypes } = require('sequelize');
const sequelize = require('<your sequelize instance>');

const Address = sequelize.define('addresses', {
  add_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  address_line1: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  address_line2: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  landmark: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  zip_code: {
    type: DataTypes.STRING(6),
    allowNull: false
  }
});

module.exports = Address;

Address.belongsTo(User, { foreignKey: 'u_id' });
Address.belongsTo(City, { foreignKey: 'city_id' });

const { DataTypes } = require('sequelize');
const sequelize = require('<your sequelize instance>');
const City = require('./city');

const State = sequelize.define('states', {
  state_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  state_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
});

State.hasMany(City, { foreignKey: 'state_id' });

module.exports = State;


const { DataTypes } = require('sequelize');
const sequelize = require('<your sequelize instance>');
const State = require('./state');

const City = sequelize.define('cities', {
  city_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  city_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
});

City.belongsTo(State, { foreignKey: 'state_id' });

module.exports = City;
