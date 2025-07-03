exports.login = (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '123123') {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
}; 