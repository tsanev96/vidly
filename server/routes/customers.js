const { Customer, validate } = require('../models/customer');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

const notFoundMsg = 'Customer with the given ID does not exist';

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });

    customer = await customer.save();
    res.send(customer);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            name: req.body.name,
            phone: req.body.phone
        }
    });
    if (!customer) return res.status(404).send(notFoundMsg);

    res.send(customer);
});

router.delete('/:id', auth, async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send(notFoundMsg);

    res.send(customer);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send(notFoundMsg);

    res.send(customer);
});

module.exports = router;

