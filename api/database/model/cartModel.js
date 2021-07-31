const { oid } = require('../dbconfig');

exports.cartModelInsert = (data) => {
  return {
    userId: oid(data.userid),    
    cartProducts: []
  }
}


// add:
// -cek stok
// -cek duplikat getArrayCart pake product id, di backend
// if duplikat :
//  +amount
// else:
//  push (product id, amount)