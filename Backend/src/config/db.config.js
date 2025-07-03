require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
console.log("URI=", uri);

async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
  }
}

module.exports = connectDB;
