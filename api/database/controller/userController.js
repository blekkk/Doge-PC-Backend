const { getCollection, oid } = require('../dbconfig');

exports.listUsers = async (req, res) => {
  const users = getCollection('users');
  try {
    let usersResult = [];
    const usersCursor = await users.find();
    usersResult = await usersCursor.toArray();

    if (!usersResult) {
      res.status(404).send('users not found');
      return
    }

    res.status(200).json(usersResult);
    usersCursor.close();
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

exports.insertUser = async (req, res) => {
  const users = getCollection('users');
  const newuser = req.body;
  try {
    const result = await users.insertOne(newuser);
    res.status(201).json({
      message: "Successfully inserted",
      result
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}