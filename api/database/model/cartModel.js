exports.cartModelInsert = (data) => {
  return {
    userId: data.id,    
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