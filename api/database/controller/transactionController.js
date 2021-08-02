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
    transactionsCursor.close();

    if (!transactionsResult) {
      res.status(404).send('Transactions not found');
      return;
    }

    res.status(200).json(transactionsResult);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

exports.getTransaction = async (req, res) => {
  const transactions = getCollection('transactions');
  try {
    const id = oid(req.verified.id);
    if (!id) {
      res.status(404).send('Invalid _id');
      return;
    }

    const transactionsCursor = await transactions.aggregate([
      { $match: { userId: id } },
      {
        $lookup: {
          from: "products",
          localField: "checkoutProduct.productId",
          foreignField: "_id",
          as: "products_info"
        }
      }
    ]);
    const userTransactionResult = await transactionsCursor.toArray();
    transactionsCursor.close();
    
    if (!userTransactionResult) {
      res.status(404).send('Transaction not found');
      return;
    }

    res.status(200).json(userTransactionResult);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

exports.getTransactionsAdmin = async (req, res) => {
  const transactions = getCollection('transactions');
  try {
    let transactionsResult = [];
    const transactionsCursor = await transactions.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user_info"
        }
      },
      { $unwind:"$user_info" },
      {
        $lookup: {
          from: "products",
          localField: "checkoutProduct.productId",
          foreignField: "_id",
          as: "products_info"
        }
      },
      {
        $project: {
          payment_method: 1,
          checkoutProduct: 1,
          buy_date: 1,
          shipment_cost: 1,
          shipment_receipt: 1,
          total_price: 1,
          address: 1,
          isArrive: 1,
          isDone: 1,
          first_name: "$user_info.first_name",
          last_name: "$user_info.last_name",
          email: "$user_info.email",
          phone_number: "$user_info.phone_number",
          product_name: "$products_info.product_name",
          price: "$products_info.price"
        }
      }
    ]);
    transactionsResult = await transactionsCursor.toArray();
    transactionsCursor.close();

    if (!transactionsResult) {
      res.status(404).send('Transactions not found');
      return;
    }

    res.status(200).json(transactionsResult);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}