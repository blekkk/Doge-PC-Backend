const userModel = (data) => {
  return {
    first_name: data.first_name,
    last_name: data?.last_name || '',
    email: data.email,
    password: data.password,
    phone_number: '',
    address: {
      street: data?.street || '',
      city: data?.city || '',
      province: data?.province || '',
      zip_code: data?.province || '' 
    },
    wishlist: []
  };
};

module.exports = { userModel };