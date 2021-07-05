const products = require('../controller/productController');

module.exports = (app) => {
  app.route('/products')
    .get(products.getProducts)
    .post(products.insertProduct);

  app.route('/products/:category')
    .get(products.getProductsWithCategory);

  app.route('/product/:id')
    .get(products.getProduct)
    .put(products.updateProduct)
    .delete(products.deleteProduct);

  app.route('/product/:id/postReview')
    .put(products.postProductReview);
};