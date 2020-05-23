const express = require('express');
const router = express.Router();
const {
  login,
  loginPost,
  register,
  registerPost,
  logout,
} = require('../controllers/auth');

router.get('/login', login).post('/login', loginPost);
router.get('/register', register).post('/register', registerPost);
router.get('/logout', logout);

module.exports = router;
