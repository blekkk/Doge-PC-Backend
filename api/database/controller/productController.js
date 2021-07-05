const { query } = require('express');
const { getCollection, oid } = require('../dbconfig');
const { productModel } = require('../model/productModel');

exports.insertProduct = async (req, res) => {
  const products = getCollection('products');
  const newProduct = productModel(req.body);
  try {
    const result = await products.insertOne(newProduct);
    res.status(201).json({
      message: "Successfully inserted",
      result
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

exports.getProducts = async (req, res) => {
  const products = getCollection('products');
  try {
    let productsResult = [];
    const productsCursor = await products.find();
    productsResult = await productsCursor.toArray();

    if (!productsResult) {
      res.status(404).send('Products not found');
      return
    }

    res.status(200).json(productsResult);
    productsCursor.close();
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

exports.getProductsWithCategory = async (req, res) => {
  const products = getCollection('products');
  try {
    const category = req.params.category;
    let productsResult = [];
    const productsCursor = await products.find({ 
      "category.main_category": category
     });
    productsResult = await productsCursor.toArray();
    console.log(productsResult);

    if (!productsResult) {
      res.status(404).send('Products not found');
      return
    }

    res.status(200).json(productsResult);
    productsCursor.close();
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

exports.updateProduct = async (req, res) => {
  const products = getCollection('products');
  const updateProduct = productModel(req.body);
  const updatedProduct = {
    $set: {
      ...updateProduct
    }
  }
  try {
    const id = oid(req.params.id);
    if (!id) {
      res.status(404).send('Invalid _id');
      return;
    }

    await products.updateOne({ _id: id }, updatedProduct);
    res.status(200).send('Update successful');
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

exports.deleteProduct = async (req, res) => {
  const products = getCollection('products');
  try {
    const id = oid(req.params.id);
    if (!id) {
      res.status(404).send('Invalid _id');
      return;
    }

    const result = await products.deleteOne({ _id: id })
    if (!result) {
      res.status(404).send('Product not found');
      return;
    }
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
}

exports.getProduct = async (req, res) => {
  const products = getCollection('products');
  try {
    const id = oid(req.params.id);
    if (!id) {
      res.status(404).send('Invalid _id');
      return;
    }

    const result = await products.findOne({ _id: id })
    if (!result) {
      res.status(404).send('Product not found');
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

exports.postProductReview = async (req, res) => {
  const products = getCollection('products');
  const productReview = req.body;
  productReview.rating = parseInt(productReview.rating);
  let avgRating;
  try {
    const id = oid(req.params.id);
    if (!id) {
      res.status(404).send('Invalid _id');
      return;
    }
    let product = await products.findOne({ _id: id })
    if (!product) {
      res.status(404).send('Product not found');
      return;
    }
    if (productReview.rating > 5 || productReview.rating <= 0) {
      res.status(400).send('Invalid request, rating only valid between 1-5');
      return;
    }
    if (product.reviews)
      avgRating = (product.reviews.reduce((acc, obj) => { return acc + obj.rating; }, 0) + productReview.rating) / (product.reviews.length + 1);
    else
      avgRating = productReview.rating;
    const pushReview = {
      $set: {
        average_rating: avgRating
      },
      $push: {
        reviews: productReview
      }
    }
    await products.updateOne({ _id: id }, pushReview);
    res.status(200).send('Update successful');
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}