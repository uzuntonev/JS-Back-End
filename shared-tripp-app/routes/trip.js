const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getDelete,
  joinToTrip,
  details,
  getCreate,
  postCreate,
  getSharedTrips
} = require('../controllers/trip');

router.get('/shared-trips', auth(), getSharedTrips)
router.get('/create', auth(), getCreate);
router.post('/create', auth(), postCreate);
router.get('/details/:id', auth(), details);
router.get('/delete/:id', auth(), getDelete);
router.get('/join/:id', auth(), joinToTrip);

module.exports = router;
