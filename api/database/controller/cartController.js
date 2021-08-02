const { getCollection, oid } = require("../dbconfig");
const { cartModelInsert, cartModelAdd, cartModelUpdate } = require("../model/cartModel");

exports.insertCart = async (req, res) => {
  const carts = getCollection("carts");
  const newCart = cartModelInsert(req.body);
  try {
    await carts.insertOne(newCart);

    return res.status(201).send("Cart inserted successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

exports.getCart = async (req, res) => {
  const carts = getCollection("carts");
  try {
    const id = oid(req.verified.id);
    if (!id) {
      res.status(404).send("Invalid _id");
      return;
    }

    const result = await carts.findOne({ userId: id });
    if (!result) {
      res.status(404).send("Cart not found");
      return;
    }
    res.status(200).json({
      cartProducts: result.cartProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

exports.addCartProduct = async (req, res) => {
  const carts = getCollection("carts");
  const cartProduct = cartModelAdd(req.body);
  try {
    const id = oid(req.verified.id);
    if (!id) {
      res.status(404).send("Invalid _id");
      return;
    }

    await carts.updateOne(
      { userId: id },
      {
        $push: {
          cartProducts: cartProduct,
        },
      }
    );
    return res.status(200).send("Successfully added product to cart");
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

exports.updateCartProduct = async (req, res) => {
  const carts = getCollection("carts");  
  const updateCartProduct = cartModelUpdate(req.body);
  try {
    updateCartProduct.cartProducts.forEach((elem) => elem.productId = oid(elem.productId))
    const updatedCartProduct = {
      $set: updateCartProduct,    
    };

    const id = oid(req.verified.id);
    if (!id) {
      res.status(404).send("Invalid _id");
      return;
    }

    await carts.updateOne({ userId: id }, updatedCartProduct);
    res.status(200).send("Update successful");
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

exports.clearCartList = async (req, res) => {
  const carts = getCollection("carts");  
  try {
    const updatedCartProduct = {
      $set: {cartProducts: []},    
    };

    const id = oid(req.verified.id);
    if (!id) {
      res.status(404).send("Invalid _id");
      return;
    }

    await carts.updateOne({ userId: id }, updatedCartProduct);
    res.status(200).send("Update successful");
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

exports.deleteCartProduct = async (req, res) => {
  const carts = getCollection("carts");
  try {
    const id = oid(req.verified.id);
    const prodId = oid(req.params.prodId);
    if (!id) {
      res.status(404).send("Invalid _id");
      return;
    }

    const tes = await carts.updateOne(
      { userId: id },
      { $pull: { cartProducts: { productId: prodId } } }
    );
    console.log(tes)
    res.status(201).send("Product successfully deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};
