const { getCollection, oid } = require('../dbconfig');
const { adminModel } = require('../model/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.adminLogin = async (req, res) => {
  const admins = getCollection('admins');
  const { email, password } = req.body;

  try {
    const admin = await admins.findOne({ email: email });
    if (!admin) return res.status(400).send('Email or password is wrong!');

    const validPasswd = await bcrypt.compare(password, admin.password)
    if (!validPasswd) return res.status(400).send('Email or password is wrong!');

    const token = jwt.sign({id: admin._id}, process.env.TOKEN_SECRET);
    return res.header('auth-token', token).status(200).send('Logged in!');
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
}

exports.adminSignUp = async (req, res) => {
  const admins = getCollection('admins');
  const newAdmin = adminModel(req.body);

  try {
    const adminExist = await admins.findOne({ email: newAdmin.email });
    if (adminExist) return res.status(400).send(
      'Admin already exist!'
    );
  
    const salt = await bcrypt.genSalt(10);
    const hashedPasswd = await bcrypt.hash(newAdmin.password, salt);
    newAdmin.password = hashedPasswd;  

    const result = await admins.insertOne(newAdmin);
    return res.status(201).send(
      'Admin signed!'
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
}

exports.getAdmin = async (req, res) => {
  const admins = getCollection('admins');
  try {
    const id = oid(req.verified.id);
    if (!id) {
      res.status(404).send('Invalid _id');
      return;
    }

    const result = await admins.findOne({ _id: id })
    if (!result) {
      res.status(404).send('Admin not found');
      return;
    }
    res.status(200).json({
      name: result.name,
      email: result.email
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}