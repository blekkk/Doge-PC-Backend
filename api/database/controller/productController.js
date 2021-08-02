const { query } = require('express');
const { getCollection, oid } = require('../dbconfig');
const { productModelInsert, productModelUpdate } = require('../model/productModel');

exports.insertProduct = async (req, res) => {
  const products = getCollection('products');
  const newProduct = productModelInsert(req.body);
  try {
    const role = req.verified.role;
    if (role !== 'admin') {
      res.status(403).send('Forbidden, only for admin');
      return;
    }

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


const handleGetProductQuery = async (products, category, queries) => {
  const sortQueryArray = []

  if (queries.priceSort)
    sortQueryArray.push(
      { "price": queries.priceSort === 'ASC' ? 1 : -1 }
    )
  if (queries.soldSort)
    sortQueryArray.push(
      { "sold_number": queries.soldSort === 'ASC' ? 1 : -1 }
    )

  const sortQueryObject = {
    $sort: Object.assign({}, ...sortQueryArray)
  }

  if (sortQueryArray.length > 0)
    return await products.aggregate([
      { $match: { "category.main_category": category, average_rating: { $gte: parseInt(queries.minRating) > 0 ? parseInt(queries.minRating) : 0 } } },
      sortQueryObject
    ]).toArray();

  return await products.aggregate([
    { $match: { "category.main_category": category, average_rating: { $gte: parseInt(queries.minRating) > 0 ? parseInt(queries.minRating) : 0 } } }
  ]).toArray();
}

const handleGetProductQueryWithName = async (products, queries) => {
  const sortQueryArray = []

  if (queries.priceSort)
    sortQueryArray.push(
      { "price": queries.priceSort === 'ASC' ? 1 : -1 }
    )
  if (queries.soldSort)
    sortQueryArray.push(
      { "sold_number": queries.soldSort === 'ASC' ? 1 : -1 }
    )

  const sortQueryObject = {
    $sort: Object.assign({}, ...sortQueryArray)
  }

  if (queries.productName) {
    productName = queries.productName.replace('%20', ' ');
    if (sortQueryArray.length > 0)
      return await products.aggregate([
        // Unsupported Atlas tier
        //{ $regexMatch: { input: '$productName', regex: new RegExp(`${queries.productName}`) } },
        { $match: { product_name: new RegExp(`${queries.productName}`, 'i'), average_rating: { $gte: parseInt(queries.minRating) > 0 ? parseInt(queries.minRating) : 0 } } },
        // Unsupported Atlas tier
        //{ $text: { $search: queries.productName } },
        sortQueryObject
      ]).toArray();
      
    return await products.aggregate([
      // Unsupported Atlas tier
      //{ $regexMatch: { input: '$productName', regex: new RegExp(`${queries.productName}`) } },
      { $match: { product_name: new RegExp(`${queries.productName}`, 'i'), average_rating: { $gte: parseInt(queries.minRating) > 0 ? parseInt(queries.minRating) : 0 } } },
      // Unsupported Atlas tier
      //{ $text: { $search: queries.productName } },
    ]).toArray();
  }

  if (sortQueryArray.length > 0)
    return await products.aggregate([
      { $match: { average_rating: { $gte: parseInt(queries.minRating) > 0 ? parseInt(queries.minRating) : 0 } } },
      sortQueryObject
    ]).toArray();

  return await products.aggregate([
    { $match: { average_rating: { $gte: parseInt(queries.minRating) > 0 ? parseInt(queries.minRating) : 0 } } }
  ]).toArray();
}

exports.getProducts = async (req, res) => {
  const products = getCollection('products');
  const { priceSort, soldSort, minRating, productName } = req.query;

  try {
    let productsResult = [];

    if (productName || priceSort || soldSort || minRating) {
      productsResult = await handleGetProductQueryWithName(products, {
        priceSort,
        soldSort,
        minRating,
        productName
      });
    } else {
      const productsCursor = await products.find({});
      productsResult = await productsCursor.toArray();
      productsCursor.close();
    }

    if (!productsResult) {
      res.status(404).send('Products not found');
      return
    }

    res.status(200).json(productsResult);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

exports.getProductsWithCategory = async (req, res) => {
  const products = getCollection('products');
  const { priceSort, soldSort, minRating } = req.query;

  try {
    const category = req.params.category;
    let productsResult = [];

    if (priceSort || soldSort || minRating) {
      productsResult = await handleGetProductQuery(products, category, {
        priceSort,
        soldSort,
        minRating
      });
    } else {
      const productsCursor = await products.find({
        "category.main_category": category
      });
      productsResult = await productsCursor.toArray();
      productsCursor.close();
    }

    if (!productsResult) {
      res.status(404).send('Products not found');
      return
    }

    res.status(200).json(productsResult);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

exports.updateProduct = async (req, res) => {
  const products = getCollection('products');
  const updateProduct = productModelUpdate(req.body);
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

    const role = req.verified.role;
    if (role !== 'admin') {
      res.status(403).send('Forbidden, only for admin');
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

    const role = req.verified.role;
    if (role !== 'admin') {
      res.status(403).send('Forbidden, only for admin');
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