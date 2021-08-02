const userRoute = require('./database/routes/userRoutes');
const productRoute = require('./database/routes/productRoutes');
const adminRoute = require('./database/routes/adminRoutes');
const cartRoute = require('./database/routes/cartRoutes')
const transactionRoute = require('./database/routes/transactionRoutes')

module.exports = (app) => {
  userRoute(app);
  productRoute(app);
  adminRoute(app);
  cartRoute(app);
  transactionRoute(app)
}
