// controllers/customerController.js
const CustomerModel = require("../models/customerModel");


const createCustomer = async (req, res) => {
  const { name, email, contact, address, status } = req.body;

  try {
    // Check if a customer with the same email already exists
    const existingCustomer = await CustomerModel.findOne({ email });

    if (existingCustomer) {
      // Customer with the same email already exists
      return res.status(200).send("EXIST");
    }

    // If no existing customer with the same email, create a new one
    const customer = await CustomerModel.create({
      name,
      email,
      contact,
      address,
      status,
    });
    res.status(201).send("SAVED");
  } catch (err) {
    console.error("Error creating customer:", err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the customer." });
  }
};



const getAllCustomers = async (req, res) => {
    try {
      // Sort by createdDate in descending order (-1)
      const customers = await CustomerModel.find().sort({ createdDate: -1 });
      res.json(customers);
    } catch (err) {
      console.error("Error retrieving customers:", err);
      res.status(500).json({ error: "An error occurred while retrieving the customers." });
    }
  };
  

const getCustomerById = async (req, res) => {
  const { customerId } = req.params;
  try {
    const customer = await CustomerModel.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found." });
    }
    res.json(customer);
  } catch (err) {
    console.error("Error retrieving customer:", err);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the customer." });
  }
};

// const updateCustomerById = async (req, res) => {
//   const { customerId } = req.params;
//   const { name, email, contact, address, status } = req.body;
//   try {
//     const customer = await CustomerModel.findByIdAndUpdate(
//       customerId,
//       { name, email, contact, address, status },
//       { new: true }
//     );
//     if (!customer) {
//       return res.status(404).json({ error: "Customer not found." });
//     }
//     res.status(200).send("UPDATED")
//   } catch (err) {
//     console.error("Error updating customer:", err);
//     res
//       .status(500)
//       .json({ error: "An error occurred while updating the customer." });
//   }
// };

const updateCustomerById = async (req, res) => {
    const { customerId } = req.params;
    const { name, email, contact, address, status } = req.body;
  
    try {
      // Check if the email exists and exclude the current customer from the check
      const existingCustomer = await CustomerModel.findOne({ email, _id: { $ne: customerId } });
  
      if (existingCustomer) {
        return res.status(200).send("EXIST");
      }
  
      // Proceed to update the customer
      const customer = await CustomerModel.findByIdAndUpdate(
        customerId,
        { name, email, contact, address, status },
        { new: true }
      );
  
      if (!customer) {
        return res.status(404).json({ error: "Customer not found." });
      }
  
      res.status(200).send("UPDATED");
    } catch (err) {
      console.error("Error updating customer:", err);
      res.status(500).json({ error: "An error occurred while updating the customer." });
    }
  };
  

const deleteCustomerById = async (req, res) => {
  const { customerId } = req.params;
  try {
    const customer = await CustomerModel.findByIdAndDelete(customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found." });
    }
    res.status(200).send("DELETED")
  } catch (err) {
    console.error("Error deleting customer:", err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the customer." });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
};
