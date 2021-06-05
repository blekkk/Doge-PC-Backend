'use strict'

const mongo = require('mongoose');
const Schema = mongo.Schema
const productSchema = new Schema({
  product_name: String,
  price: Number,
  weight: Number,
  stock: Number,
  category: {
    main_category: String,
    scondary_category: String,
  },
  brand: String,
  specification:{
    socket_type: String,
    ddr_type: String,
  },
  product_picture: String,
  average_rating: Number,
  reviews: [
    {
      reviewer_name: String,
      rating: Number,
      comment: String,
    },
  ],
  sold_number: Number,
});

module.exports = mongo.model('product', productSchema);