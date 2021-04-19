'use strict'

const mongo = require ('mongoose');

const Schema = mongo.Schema;

const userSchema = new Schema({
    
    name: String,
    age: Number,
    address: {
        city: String,
        region: String,
        country: String
    },
    isMarried: Boolean
})

module.exports = mongo.model('users', userSchema);