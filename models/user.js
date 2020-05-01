const Joi = require('@hapi/joi');
const passComplexity = require('joi-password-complexity');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        min: 5,
        max: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024 // hash password
    }
}));

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    })
    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;