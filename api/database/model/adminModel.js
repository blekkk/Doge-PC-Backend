const adminModel = (data) => {
  return {
    name: data.name,
    email: data.email,
    password: data.password
  };
};

module.exports = { adminModel };