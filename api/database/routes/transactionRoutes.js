const transactions = require('../controller/transactionController')
const verifyToken = require('../../middleware/verifyToken')

module.exports = (app) => {
  app.route('/checkout/all')
    .get(verifyToken, transactions.getTransactions)
    .post(verifyToken, transactions.insertTransaction)

  app.route('/checkout/user')
    .get(verifyToken, transactions.getTransaction)
}