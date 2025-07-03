const User = require('../models/User.model');

// GET /users - get all users sorted by score descending
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ score: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /users - add a new user
exports.createUser = async (req, res) => {
  try {
    const { name, score } = req.body;
    const user = new User({ name, score });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /users/:id - update a user's score
exports.updateUserScore = async (req, res) => {
  try {
    const { score } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { score },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /users/:id - delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 