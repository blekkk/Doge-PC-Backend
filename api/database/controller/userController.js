const { getCollection, oid } = require('../dbconfig');
const { userModel } = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.userSignIn = async (req, res) => {
  const users = getCollection('users');
  const { email, password } = req.body;

  try {
    const user = await users.findOne({ email: email });
    if (!user) return res.status(400).send('Email or password is wrong!');

    const validPasswd = await bcrypt.compare(password, user.password);
    if (!validPasswd) return res.status(400).send('Email or password is wrong!');

    const token = jwt.sign({id: user._id}, process.env.TOKEN_SECRET);
    return res.header('auth-token', token).status(200).send('Logged in!');
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
}

exports.userSignUp = async (req, res) => {  
  const users = getCollection('users');
  const newUser = userModel(req.body);

  try {
    const userExist = await users.findOne({email: newUser.email});
    if (userExist) return res.status(400).send(
      'User already exist!'
    );

    const salt = await bcrypt.genSalt(10);
    const hashedPasswd = await bcrypt.hash(newUser.password, salt);
    newUser.password = hashedPasswd;

    const result = await users.insertOne(newUser);
    return res.status(201).send(
      'User signed!'
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
}

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