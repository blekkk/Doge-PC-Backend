const users = require('../controller/userController');
const verifyToken = require('../../middleware/verifyToken');

module.exports = (app) => {
  app.route('/users')
    .get(users.listUsers);

  app.route('/user')
    .get(verifyToken, users.getUser)
    .put(verifyToken, users.updateUser);

  app.route('/user/changepassword')
    .put(verifyToken, users.changePassword)

  app.route('/user/signup')
    .post(users.userSignUp);

  app.route('/user/signin')
    .post(users.userSignIn);

  app.route('/user/wishlist/add')
    .put(verifyToken, users.addToWishlist);

  app.route('/user/wishlist/remove')
    .put(verifyToken, users.removeFromWishlist);
}