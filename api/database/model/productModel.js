exports.productModelInsert = (data) => {
  return {
    product_name: data.product_name,
    price: data.price,
    discount_price: data.discount_price,
    weight: data.weight,
    stock: data.stock,
    category: {
      main_category: data.main_category,
      secondary_category: data?.secondary_category || '',
    },
    brand: data.brand,
    average_rating: 0,
    product_picture: data?.picture || '',
    sold_number: 0,
    reviews: []
  };
};

exports.productModelUpdate = (data) => {
  return {
    product_name: data.product_name,
    price: data.price,
    discount_price: data.discount_price,
    weight: data.weight,
    stock: data.stock,
    category: {
      main_category: data.main_category,
      secondary_category: data?.secondary_category || '',
    },
    brand: data.brand,
    product_picture: data?.picture || '',
  };
}