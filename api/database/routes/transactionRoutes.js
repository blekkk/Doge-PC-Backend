const transactions = require('../controller/transactionController')
const verifyToken = require('../../middleware/verifyToken')

module.exports = (app) => {
  app.route('/checkout')
    .get(verifyToken, transactions.getTransaction)
    .post(verifyToken, transactions.insertTransaction)
}