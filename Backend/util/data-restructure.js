exports.dataRestructure = (data) => {
  const result = [];
  for (let index = 0; index < data.length; index++) {
    const userData = data[index].user;
    const userAddress = data[index];
    const userCities = data[index].city;
    const userState = userCities.state;
    const res = {
      u_id: userData.u_id,
      f_name: userData.f_name,
      m_name: userData.m_name,
      l_name: userData.l_name,
      email: userData.email,
      contact: userData.contact,
      password: userData.password,
      date_of_birth: userData.date_of_birth,
      gender: userData.gender,
      del: userData.del,
      role: userData.role,
      add_id: userAddress.add_id,
      address_line1: userAddress.address_line1,
      address_line2: userAddress.address_line2,
      landmark: userAddress.landmark,
      zip_code: userAddress.zip_code,
      city_id: userCities.city_id,
      city_name: userCities.city_name,
      state_id: userState.state_id,
      state_name: userState.state_name,
    };
    result.push(res);
  }
  return result;
};
