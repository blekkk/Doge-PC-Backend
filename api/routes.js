'use strict'

const userRoute = require('./database/routes/userRoutes');
const productRoute = require('./database/routes/productRoutes');

module.exports = (app) => {
  userRoute(app);
  productRoute(app);
}
