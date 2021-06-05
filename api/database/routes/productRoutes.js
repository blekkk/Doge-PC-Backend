const products = require('../controller/productController');

module.exports = (app) => {
  app.route('/products')
    .get(products.getProducts)
    .post(products.insertProduct);

  app.route('/product/:id')
    .get(products.getProduct)
    .put(products.updateProduct);

  app.route('/product/:id/postReview')
    .put(products.postProductReview);
};