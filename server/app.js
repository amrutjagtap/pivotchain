// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const customerRoutes = require('./routes/customerRoutes');

const app = express();
const port = 8080;

// MongoDB Atlas connection string and database name
// const mongoUrl = 'mongodb://localhost:27017/customerdb';
const mongoUrl = 'mongodb://127.0.0.1:27017/customerdb';

const dbName = 'customerdb';

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

app.use(bodyParser.json());
app.use(cors());

// Use the customer routes
// app.use("/", (req, res) => {
//     res.send("Welcome to the App!"); // Send the welcome message as the response
//   });

app.use('/customers', customerRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
