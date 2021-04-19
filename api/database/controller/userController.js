const User = require('../models/userSchema');

exports.listUsers = (req, res) => {
    User.find({}, (err, data) => {
        if (err)
            res.status(500).send(err)
        else
            res.status(200).json(data);
    })
}

exports.insertUser = (req, res) => {
    let newUser = new User(req.body);
    newUser.save((err, data) => {
        if (err)
            res.status(500).send(err)
        else
            res.status(201).json(data);
    })
}