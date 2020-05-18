const {
  home,
  about,
  details,
  getCreate,
  postCreate,
  notFound,
  getDeleteCube,
  postDeleteCube,
  getEditCube,
  postEditCube,
} = require('../controllers/cube');

const {
  accessoryGetCreate,
  accessoryPostCreate,
  accessoryGetAttach,
  accessoryPostAttach,
} = require('../controllers/accessory');

const {
  login,
  loginPost,
  register,
  registerPost,
  logout,
} = require('../controllers/auth');

const auth = require('../middlewares/auth');

module.exports = (app) => {
  app.get('/', auth(false), home);
  app.get('/about', auth(false), about);
  app.get('/create', auth(), getCreate).post('/create', auth(), postCreate);
  app.get('/details/:id', auth(), details);
  app
    .get('/create/accessory', auth(), accessoryGetCreate)
    .post('/create/accessory', auth(), accessoryPostCreate);
  app
    .get('/attach/accessory/:id', auth(), accessoryGetAttach)
    .post('/attach/accessory/:id', auth(), accessoryPostAttach);
  app.get('/login', login).post('/login', loginPost);
  app.get('/register', register).post('/register', registerPost);
  app.get('/logout', logout);
  app
    .get('/delete/:id', auth(), getDeleteCube)
    .post('/delete/:id', auth(), postDeleteCube);
  app
    .get('/edit/:id', auth(), getEditCube)
    .post('/edit/:id', auth(), postEditCube);
  app.get('*', notFound);
};
