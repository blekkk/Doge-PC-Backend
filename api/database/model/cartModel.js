const { oid } = require("../dbconfig");

exports.cartModelInsert = (data) => {
  return {
    userId: oid(data.userid),
    cartProducts: [],
  };
};

exports.cartModelUpdate = (data) => {
  return {
    cartProducts: data.cartProducts,
  };
};

exports.cartModelAdd = (data) => {
  return {
    productId: oid(data.productId),
    amount: data.amount,
  };
};
// add:
// -cek stok
// -cek duplikat getArrayCart pake product id, di backend
// if duplikat :
//  +amount
// else:
//  push (product id, amount)
