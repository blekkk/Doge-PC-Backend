const { adminLogin, adminSignUp, getAdmin } = require("../controller/adminController");
const verifyToken = require('../../middleware/verifyToken');

module.exports = (app) =>  {
  app.route('/admin/login')
    .post(adminLogin);

  app.route('/admin/signup')
    .post(adminSignUp);

  app.route('/admin')
    .get(verifyToken, getAdmin);
}