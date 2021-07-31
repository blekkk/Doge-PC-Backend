const { oid } = require('../dbconfig');

exports.userModelInsert = (data) => {
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
      zip_code: data?.zip_code || '' 
    },
    wishlist: []
  };
};

exports.userModelUpdate = (data) => {
  return {
    first_name: data.first_name,
    last_name: data?.last_name || '',
    phone_number: data?.phone_number || '',
    address: {
      street: data?.street || '',
      city: data?.city || '',
      province: data?.province || '',
      zip_code: data?.zip_code || '' 
    },
  };
};

exports.userWishlistModelInsert = (data) => {
  return {
    productId: oid(data.productId),
    product_name: data.product_name,
    price: data.price,
    average_rating: data.average_rating
  }
}