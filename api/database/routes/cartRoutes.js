const carts = require('../controller/cartController');
const verifyToken = require('../../middleware/verifyToken');

module.exports = (app) => {
  app.route('/cart')
    .post(carts.insertCart);
}