const bcrypt = require("bcrypt");
const sequelize = require("../config/database");
const Addresses = require("../models/addresses");
const Cities = require("../models/cities");
const States = require("../models/states");
const Users = require("../models/users");
const { Op } = require("sequelize");
const BlackTokens = require("../models/blacktokens");
const { mapState } = require("../util/state-map");
const { dataRestructure } = require("../util/data-restructure");

exports.getAllUsersService = async (page, limit) => {
  const offset = (page - 1) * limit;
  //This find all method works same as select statement and we can declare all the attributes inside the method
  //Also we do not have to specify the join explicitly as sequelize takes care of that internally. Also instead of join we have
  //To specify the relations in appropriate format. For eg in below method the Addresses table contains the foreign key of users
  //and cities and the cities table contains the foreign key of state table.
  //The equivalent method we can consider is
  //     SELECT *
  //     FROM users
  //     JOIN addresses ON users.u_id = addresses.u_id
  //     JOIN cities ON addresses.city_id = cities.city_id
  //     JOIN states ON cities.state_id = states.state_id
  //     WHERE users.del='0' ORDER BY users.u_id LIMIT YourLimit OFFSET YourOffSetValue;
  const data = await Addresses.findAll({
    offset,
    limit,
    include: [
      {
        model: Users,
        where: {
          del: "0",
        },
      },
      {
        model: Cities,
        include: [States],
      },
    ],
    order: [[Users, "u_id", "ASC"]],
  });
  //The count method works same as
  //SELECT count(*) FROM Users;
  const totalRecords = await Users.count({
    where: {
      del: "0",
    },
  });

  return {
    data: dataRestructure(data),
    totalRecords: totalRecords,
    totalPages: Math.ceil(totalRecords / limit),
  };
};

//This method query the table and related models with like attribute
//The equivalent method we can consider is
//     SELECT *
//     FROM ums.users
//     JOIN ums.addresses ON users.u_id = addresses.u_id
//     JOIN ums.cities ON addresses.city_id = cities.city_id
//     JOIN ums.states ON cities.state_id = states.state_id
//     WHERE users.email LIKE '%keyword we want to specify%' AND del='0'

exports.getSingleUserService = async (id) => {
  id = id.trim().toLowerCase();
  const data = await Addresses.findAll({
    include: [
      {
        model: Users,
        where: {
          del: "0",
          email: { [Op.like]: `%${id}%` },
        },
      },
      {
        model: Cities,
        include: [States],
      },
    ],
  });
  console.log(dataRestructure(data).length);
  return dataRestructure(data);
};

//The specified method works like soft delete where we are just updating the del column value to 1.
//The equivalent raw operations is
// UPDATE users set del='1' where u_id= <User Id>
exports.deleteUserService = async (id) => {
  const del = await Users.update({ del: "1" }, { where: { u_id: `${id}` } });
  if (del[0] === 0) {
    return false;
  } else {
    return true;
  }
};
//The specified method updates the all the data tables with respect to the data received
//Here we are updating all the tables separately as bult update is not available in the sequelize.
//The equivalent queries are as below
//update users set f_name='<First Name>', m_name='<Middle Name>', l_name='<Last Name>', email='<Email>',contact='<Contact>', password='<Password>', date_of_birth='<Date Of Birth>', gender='<Gender>' where u_id=<user-id>
//update addresses set address_line1='<addressLine1>', address_line2='<addressLine2>', landmark='<Landmark>', zip_code='<Zip_Code>' where add_id=<address id>
//update cities set city_name='<city_name>', state_id='<State_id>' where city_id=<city_id>
//Here we have already added all the states and will directly map the state id
exports.updateUserService = async (id, body) => {
  const userExists = await Users.findAll({ where: { u_id: `${id}` } });
  console.log(userExists);
  if (userExists.length === 0) {
    console.log(userExists.length === 0);
    return false;
  } else {
    const result = await sequelize.transaction(async (t) => {
      const updateUser = await Users.update(
        {
          f_name: body.f_name,
          m_name: body.m_name,
          l_name: body.l_name,
          email: body.email,
          contact: body.contact,
          password: body.password,
          date_of_birth: body.date_of_birth,
          gender: body.gender,
          updatedby: body.updatedBy,
        },
        { where: { u_id: `${id}` } },
        { transaction: t }
      );
      const updateAddress = await Addresses.update(
        {
          address_line1: body.address_line1,
          address_line2: body.address_line2,
          landmark: body.landmark,
          zip_code: body.zip_code,
        },
        { where: { add_id: `${body.add_id}` } },
        { transaction: t }
      );
      const updateCity = await Addresses.update(
        {
          city_name: body.city_name,
          stateStateId: mapState(body.state_name),
        },
        { where: { city_id: `${body.city_id}` } },
        { transaction: t }
      );
    });
    return true;
  }
};
// The specified method inserts the user based on the parameters defined in the models
// The equivalent query implementation can be described as below
// INSERT INTO ums.users (f_name, m_name, l_name, email, contact, password, date_of_birth, gender) VALUES
// ('<FirstName>', '<MiddleName>', '<LastName>', '<MiddleName>', '<Contact>', '<Password>', '<Date Of Birth>', '<Gender>')
// INSERT INTO cities (city_name, state_id) VALUES ('<city_name>', <state_id>)
// INSERT INTO ums.addresses ( address_line1, address_line2, landmark,zip_code, city_id,u_id) VALUES ( '<Address_line1>', '<Address_line2>', '<landmark>','<zip_code>', <city_Id>,<User_id>);
exports.createUserService = async (user) => {
  user.email = user.email.toLowerCase();
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  const result = await sequelize.transaction(async (t) => {
    const createCity = await Cities.create(
      {
        city_name: user.city_name,
        stateStateId: mapState(user.state_name),
      },
      { transaction: t }
    );
    const createUser = await Users.create(
      {
        f_name: user.f_name,
        m_name: user.m_name,
        l_name: user.l_name,
        email: user.email,
        contact: user.contact,
        password: user.password,
        date_of_birth: user.date_of_birth,
        gender: user.gender,
        createdby: user.createdBy,
      },
      { transaction: t }
    );
    const createAddress = await Addresses.create(
      {
        address_line1: user.address_line1,
        address_line2: user.address_line2,
        landmark: user.landmark,
        zip_code: user.zip_code,
        userUId: createUser.u_id,
        cityCityId: createCity.city_id,
      },
      { transaction: t }
    );
  });
  return true;
};

exports.logInUserService = async (data) => {
  const user = await Users.findOne({
    where: {
      email: data.email,
    },
  });
  if ((await user) === null) {
    return { success: false, payload: null };
  } else if (bcrypt.compareSync(data.password, await user.password)) {
    return { success: true, payload: user.f_name };
  } else {
    return { success: false, payload: null };
  }
};

exports.logOutUserService = async (data) => {
  if (data.length !== 0) {
    const token = await BlackTokens.create({ token: data.token });
    return true;
  } else {
    return false;
  }
};
