const { oid } = require('../dbconfig')

exports.checkoutInsert = (data) => {
  return {
    userId: oid(data.userId),
    payment_method: data.payment_method,
    checkoutProduct: data.checkoutProduct,
    buy_date: data.buy_date,
    shipment_cost: data.shipment_cost,
    shipment_receipt: data.shipment_cost,
    total_price: data.total_price,
    isArrive: data.isArrive,
    isDone: data.isDone
  }
}