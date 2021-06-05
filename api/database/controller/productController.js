const Product = require('../models/productSchema');

exports.insertProduct = (req, res) => {
  const newProduct = new Product(req.body);

  newProduct.save((err, data) => {
    if (err) res.status(500).send(err);

    res.status(201).json(data);
  })
}

exports.getProducts = (req, res) => {
  Product.find({}, (err, data) => {
    if (err) res.status(500).send(err);

    res.status(200).json(data);
  })
}

exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  const updateProduct = req.body;

  let product = await Product.findById(id);
  product = {
    ...product._doc,
    ...updateProduct
  };
  
  Product.replaceOne({_id: id}, product, (err, data) => {
    if (err) res.status(500).send(err);

    res.status(200).json(data);
  })
}

exports.getProduct = (req, res) => {
  const id = req.params.id;
  
  Product.findById(id, (err, data) => {
    if (err) res.status(404).send("Product not found");

    res.status(200).json(data);
  })
}

exports.postProductReview = async (req, res) => {
  const id = req.params.id;
  const productComment = req.body;
  
  let product = await Product.findById(id);
  product = {
    ...product._doc,
  };

  productComment.rating = parseInt(productComment.rating);

  product.reviews.push(productComment);

  const avgRating = product.reviews.reduce((acc, obj) => {return acc + obj.rating;}, 0) / product.reviews.length;

  product = {
    ...product,
    average_rating: avgRating,
  };
  
  Product.replaceOne({_id: id}, product, (err, data) => {
    if (err) res.status(500).send(err);

    res.status(200).json(data);
  })
}