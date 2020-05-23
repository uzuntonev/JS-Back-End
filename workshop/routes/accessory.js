const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  accessoryGetCreate,
  accessoryPostCreate,
  accessoryGetAttach,
  accessoryPostAttach,
} = require('../controllers/accessory');

router
  .get('/create/accessory', auth(), accessoryGetCreate)
  .post('/create/accessory', auth(), accessoryPostCreate);
router
  .get('/attach/accessory/:id', auth(), accessoryGetAttach)
  .post('/attach/accessory/:id', auth(), accessoryPostAttach);

module.exports = router;
