// routes/customerRoutes.js
const express = require('express');
const customerController = require('../controllers/customerController');

const router = express.Router();

router.post('/', customerController.createCustomer);
router.get('/', customerController.getAllCustomers);
router.get('/:customerId', customerController.getCustomerById);
router.put('/:customerId', customerController.updateCustomerById);
router.delete('/:customerId', customerController.deleteCustomerById);

module.exports = router;
