const { getCollection, oid } = require('../dbconfig');
const { cartModelInsert } = require('../model/cartModel');

exports.insertCart = async (req, res) => {
  const carts = getCollection('carts');
  const newCart = cartModelInsert(req.body);
  try {
    await carts.insertOne(newCart);

    return res.status(201).send('Cart inserted successfully')
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
}