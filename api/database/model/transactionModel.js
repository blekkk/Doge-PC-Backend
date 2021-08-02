const { oid } = require('../dbconfig')

exports.checkoutModelInsert = (data) => {
  return {
    address: data.address,
    payment_method: data.payment_method,
    checkoutProduct: data.checkoutProduct,
    buy_date: new Date(),
    shipment_cost:  data.shipment_cost,
    shipment_receipt: data.shipment_receipt,
    total_price: data.total_price,
    isArrive: true,
    isDone: true
  }
}