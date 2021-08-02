const products = require('../controller/productController');
const verifyToken = require('../../middleware/verifyToken');

module.exports = (app) => {
  app.route('/products')
    .get(products.getProducts)
    //Only for admin
    .post(verifyToken, products.insertProduct);

  app.route('/products/:category')
    .get(products.getProductsWithCategory);

  app.route('/product/:id')
    .get(products.getProduct)
    //Only for admin
    .put(verifyToken, products.updateProduct)
    .delete(verifyToken, products.deleteProduct);

  app.route('/product/:id/postReview')
    .put(products.postProductReview);
};