const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const { getUser, refillAmount } = require('../controllers/user');

router.get('/account-info', auth(), getUser);
router.post('/refill', auth(), refillAmount);

module.exports = router;
