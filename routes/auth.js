const { User } = require('../models/user');
const config = require('config')
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const invalidMsg = 'Invalid email or password';

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(invalidMsg);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send(invalidMsg);

    const validatePassword = await bcrypt.compare(req.body.password, user.password);
    if (!validatePassword) return res.status(400).send(invalidMsg);

    const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
    res.send(token);
});


function validate(login) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(50).required()
    });
    return schema.validate(login);
}

module.exports = router;