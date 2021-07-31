const adminModel = (data) => {
  return {
    name: data.name,
    email: data.email,
    password: data.password,
    role: "admin"
  };
};

module.exports = { adminModel };