const { getCollection, oid } = require('../dbconfig')
const { checkoutModelInsert } = require('../model/transactionModel')

exports.insertTransaction = async (req, res) => {
  const transactions = getCollection('transactions');
  const products = getCollection('products');
  const newTransaction = checkoutModelInsert(req.body);
  try {
    newTransaction.userId = oid(req.verified.id)
    for (let i=0; i<newTransaction.checkoutProduct.length; i++) {
      newTransaction.checkoutProduct[i].productId = oid(newTransaction.checkoutProduct[i].productId)
      const product = await products.findOne({_id : newTransaction.checkoutProduct[i].productId})
      if (newTransaction.checkoutProduct[i].amount > product.stock) {
        return res.status(400).send('Out of Stock')
      } 
      await products.updateOne({_id: newTransaction.checkoutProduct[i].productId}, {
        $set: {
          stock: product.stock - newTransaction.checkoutProduct[i].amount,
          sold_number: product.sold_number + newTransaction.checkoutProduct[i].amount
        }
      })
    }

    const result = await transactions.insertOne(newTransaction);
    res.status(201).json({
      message: "Successfully inserted",
      result
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

exports.getTransactions = async (req, res) => {
  const transactions = getCollection('transactions');
  try {
    let transactionsResult = [];
    const transactionsCursor = await transactions.find();
    transactionsResult = await transactionsCursor.toArray();

    if (!transactionsResult) {
      res.status(404).send('Transactions not found');
      return;
    }

    res.status(200).json(transactionsResult);
    transactionsCursor.close();
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

exports.getTransaction = async (req, res) => {
  const transactions = getCollection('transactions');
  try {
    userTransactionResult = [];
    const id = oid(req.params.id);
    if (!id) {
      res.status(404).send('Invalid _id');
      return;
    }

    const transactionsCursor = await transactions.find({userId: id});
    transactionsResult = await transactionsCursor.toArray();
    if (!transactionResult) {
      res.status(404).send('Transaction not found');
      return;
    }

    res.status(200).json(transactionResult);
    transactionsCursor.close();
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}