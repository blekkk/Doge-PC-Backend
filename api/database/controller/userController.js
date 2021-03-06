const { getCollection, oid } = require('../dbconfig');
const { userModelInsert, userModelUpdate, userWishlistModelInsert } = require('../model/userModel');
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

    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
    return res.header('auth-token', token).status(200).send('Logged in!');
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
}

exports.userSignUp = async (req, res) => {
  const users = getCollection('users');
  const newUser = userModelInsert(req.body);

  try {
    const userExist = await users.findOne({ email: newUser.email });
    if (userExist) return res.status(400).send(
      'User already exist!'
    );

    const salt = await bcrypt.genSalt(10);
    const hashedPasswd = await bcrypt.hash(newUser.password, salt);
    newUser.password = hashedPasswd;

    const result = await users.insertOne(newUser);
    return res.status(201).json({
      message: 'User signed!',
      userid: result.ops[0]._id
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
}

exports.listUsers = async (req, res) => {
  const users = getCollection('users');
  try {
    let usersResult = [];
    const usersCursor = await users.find().project({
      first_name: 1,
      last_name: 1,
      email: 1,
      phone_number: 1,
      address: 1,
      wishlist: 1
    });
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

exports.getUser = async (req, res) => {
  const users = getCollection('users');
  try {
    const id = oid(req.verified.id);
    if (!id) {
      res.status(404).send('Invalid _id');
      return;
    }

    const result = await users.findOne({ _id: id })
    if (!result) {
      res.status(404).send('user not found');
      return;
    }
    res.status(200).json({
      first_name: result.first_name,
      last_name:result.last_name,
      phone_number: result.phone_number,
      address: {
        street: result.address.street,
        city: result.address.city,
        province: result.address.province,
        zip_code: result.address.zip_code
      },
      wishlist: result.wishlist
    })
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

exports.updateUser = async (req, res) => {
  const users = getCollection('users');
  const userModel = userModelUpdate(req.body);
  const setUpdate = {
    $set: {
      ...userModel
    }
  };
  try {
    const id = oid(req.verified.id);
    if (!id) {
      res.status(404).send('Invalid _id');
      return;
    }

    await users.updateOne({ _id: id }, setUpdate);
    return res.status(200).send('Successfully updated');
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

exports.changePassword = async (req, res) => {
  const users = getCollection('users');
  const { password } = req.body;
  try {
    const id = oid(req.verified.id);
    if (!id) {
      return res.status(404).send('Invalid _id');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPasswd = await bcrypt.hash(password, salt);

    await users.updateOne({ _id: id }, {
      $set: {
        password: hashedPasswd
      }
    })
    return res.status(200).send('Successfully updated');
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

exports.addToWishlist = async (req, res) => {
  const users = getCollection('users');
  const wishlistItem = userWishlistModelInsert(req.body);
  try {
    const id = oid(req.verified.id);
    if (!id) {
      res.status(404).send('Invalid _id');
      return;
    }

    await users.updateOne({ _id: id }, {
      $push: {
        wishlist: wishlistItem
      }
    })
    return res.status(200).send('Successfully added');
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

exports.removeFromWishlist = async (req, res) => {
  const users = getCollection('users');
  const productId = req.body.productId;
  try {
    const id = oid(req.verified.id);
    if (!id) {
      res.status(404).send('Invalid _id');
      return;
    }

    await users.updateOne({ _id: id }, {
      $pull: {
        wishlist: oid(productId)
      },
    });

    return res.status(200).send('Successfully removed');
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

exports.getUserById = async (req, res) => {
  const users = getCollection('users');
  try {
    const userId = oid(req.params.id);
    const id = oid(req.verified.id);
    if (!id || !userId) {
      res.status(404).send('Invalid _id');
      return;
    }

    const role = req.verified.role;
    if (role !== 'admin') {
      res.status(403).send('Forbidden, only for admin');
      return;
    }

    const result = await users.findOne({ _id: userId })
    if (!result) {
      res.status(404).send('user not found');
      return;
    }
    res.status(200).json({
      first_name: result.first_name,
      last_name:result.last_name,
      phone_number: result.phone_number,
      address: {
        street: result.address.street,
        city: result.address.city,
        province: result.address.province,
        zip_code: result.address.zip_code
      },
      wishlist: result.wishlist
    })
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

exports.deleteUserById = async (req, res) => {
  const users = getCollection('users');
  try {
    const userId = oid(req.params.id);
    const id = oid(req.verified.id);
    if (!id || !userId) {
      res.status(404).send('Invalid _id');
      return;
    }

    const role = req.verified.role;
    if (role !== 'admin') {
      res.status(403).send('Forbidden, only for admin');
      return;
    }

    await users.deleteOne({ _id: userId })
    res.status(201).send('User successfully deleted');
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}