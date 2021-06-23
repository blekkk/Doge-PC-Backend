const users = require('../controller/userController');

module.exports = (app) => {
  app.route('/users')
    .get(users.listUsers)
    .post(users.insertUser);
}