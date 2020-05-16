const {
  home,
  about,
  details,
  getCreate,
  postCreate,
  notFound,
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
  app.get('/', home);
  app.get('/about', about);
  app.get('/create', auth(), getCreate).post('/create', postCreate);
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
  app.get('*', notFound);
};
