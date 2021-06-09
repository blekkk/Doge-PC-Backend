'use strict'

const mongo = require('mongoose');
const Schema = mongo.Schema;
const userSchema = new Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  profile_picture: String,
  isVerified: Boolean,
  verify_token: String,
  phone_number: String,
  address: {
    _id: false,
    sreet: String,
    city: String,
    region: String,
    zip_code: String,
  },
  wishlist: [
    {
      _id: false,
      product_id: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'products'
      },
      product_name: String,
    },
  ],
});

module.exports = mongo.model('users', userSchema);
