'use strict'

module.exports = (app) => {

    const users = require('../controller/userController');

    app.route('/users')
    .get(users.listUsers)
    .post(users.insertUser);
}