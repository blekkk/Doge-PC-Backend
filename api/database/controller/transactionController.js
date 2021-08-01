const { getCollection, oid } = require('../dbconfig')
const { checkoutInsert } = require('../model/transactionModel')

exports.insertTransaction = async (req, res) => {
  const transactions = getCollection('products');
  const newTransaction = productModelInsert(req.body);
  try {
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
      res.status(404).send('Products not found');
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