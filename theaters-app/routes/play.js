const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getDelete,
  detailsPlay,
  getCreate,
  postCreate,
  getEdit,
  postEdit,
  getLiked,
} = require('../controllers/play');

router.get('/create', auth(), getCreate);
router.post('/create', auth(), postCreate);

router.get('/edit/:id', auth(), getEdit);
router.post('/edit/:id', auth(), postEdit);

router.get('/details/:id', auth(), detailsPlay);
router.get('/delete/:id', auth(), getDelete);
router.get('/like/:id', auth(), getLiked);

module.exports = router;
