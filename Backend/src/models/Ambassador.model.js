const mongoose = require('mongoose');

const ambassadorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  university: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },  
  score: { type: Number, required: true },
  totalPoints: { type: Number, required: true }, 
  leaderboardPosition: { type: Number, required: true },
  CA_batch: { type: String, required: true }  
}, {
  timestamps: true,
  collection: 'campus_ambassadors'
});

module.exports = mongoose.model('Ambassador', ambassadorSchema);
