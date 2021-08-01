const carts = require('../controller/cartController');
const verifyToken = require('../../middleware/verifyToken');

module.exports = (app) => {
  app.route('/cart')
    .post(carts.insertCart)
    .get(verifyToken, carts.getCart)
    .put(verifyToken, carts.addCartProduct)

  app.route('/cart/:prodId')    
    .delete(verifyToken, carts.deleteCartProduct)
}