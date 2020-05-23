const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getDeleteCube,
  postDeleteCube,
  getEditCube,
  postEditCube,
  details,
  getCreate,
  postCreate,
} = require('../controllers/cube');

router.get('/create', auth(), getCreate).post('/create', auth(), postCreate);
router.get('/details/:id', auth(), details);
router
  .get('/delete/:id', auth(), getDeleteCube)
  .post('/delete/:id', auth(), postDeleteCube);
router
  .get('/edit/:id', auth(), getEditCube)
  .post('/edit/:id', auth(), postEditCube);

module.exports = router;
