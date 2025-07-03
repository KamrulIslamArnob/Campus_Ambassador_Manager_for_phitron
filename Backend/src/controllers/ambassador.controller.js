const Ambassador = require('../models/Ambassador.model');
const Trie = require('../utils/Trie');

let nameTrie = new Trie();

// Populate Trie with ambassador names
async function populateTrie() {
  const ambassadors = await Ambassador.find({}, 'name');
  nameTrie = new Trie();
  ambassadors.forEach(a => nameTrie.insert(a.name));
}

// Call this on server start
populateTrie();

// Optionally, re-populate Trie on demand (e.g., after ambassador add/delete)
exports.refreshTrie = populateTrie;

exports.getAllAmbassadors = async (req, res) => {
  try {
    const ambassadors = await Ambassador.find();
    res.json(ambassadors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/ambassadors/stats
exports.getStats = async (req, res) => {
  try {
    const ambassadors = await Ambassador.find();
    const total = ambassadors.length;
    const active = ambassadors.filter(a => a.active).length; // assumes 'active' field
    // Weekly score change: sum of score changes in last 7 days
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyScoreChange = ambassadors.reduce((sum, a) => {
      if (a.updatedAt > oneWeekAgo) {
        return sum + (a.score || 0);
      }
      return sum;
    }, 0);
    res.json({ total, active, weeklyScoreChange });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/ambassadors/activity
exports.getRecentActivity = async (req, res) => {
  try {
    const recent = await Ambassador.find().sort({ updatedAt: -1, createdAt: -1 }).limit(10);
    res.json(recent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/ambassadors/search?name=prefix
exports.searchAmbassadorNames = async (req, res) => {
  const { name = '' } = req.query;
  if (!name) return res.json([]);
  // Fast prefix search
  const matches = nameTrie.searchPrefix(name);
  res.json(matches);
};

// POST /api/ambassadors
exports.createAmbassador = async (req, res) => {
  try {
    const { name, university, email, phone, score, totalPoints, leaderboardPosition, CA_batch } = req.body;
    const ambassador = new Ambassador({ name, university, email, phone, score, totalPoints, leaderboardPosition, CA_batch });
    await ambassador.save();
    await populateTrie(); // Refresh Trie after adding
    res.status(201).json(ambassador);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/ambassadors/:id
exports.updateAmbassador = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const ambassador = await Ambassador.findByIdAndUpdate(id, update, { new: true });
    if (!ambassador) return res.status(404).json({ error: 'Ambassador not found' });
    await populateTrie(); // Refresh Trie after update
    res.json(ambassador);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/ambassadors/:id
exports.deleteAmbassador = async (req, res) => {
  try {
    const { id } = req.params;
    const ambassador = await Ambassador.findByIdAndDelete(id);
    if (!ambassador) return res.status(404).json({ error: 'Ambassador not found' });
    await populateTrie(); // Refresh Trie after delete
    res.json({ message: 'Ambassador deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 