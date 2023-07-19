// models/customerModel.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: String,
  address: String,
  status: String,
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const CustomerModel = mongoose.model('Customer', customerSchema);

module.exports = CustomerModel;
