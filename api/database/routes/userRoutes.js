const users = require('../controller/userController');
const verifyToken = require('../../middleware/verifyToken');

module.exports = (app) => {
  app.route('/user')
    .get(users.listUsers);

  app.route('/user/signup')
  .post(users.userSignUp);

  app.route('/user/signin')
  .post(users.userSignIn);
}