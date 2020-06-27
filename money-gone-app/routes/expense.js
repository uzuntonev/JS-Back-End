const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getDelete,
  postEditCube,
  report,
  getCreate,
  postCreate,
} = require('../controllers/expense');

router.get('/create', auth(), getCreate);
router.post('/create', auth(), postCreate);
router.get('/report/:id', auth(), report);
router.get('/delete/:id', auth(), getDelete);
router.post('/edit/:id', auth(), postEditCube);

module.exports = router;
