const { home, about, notFound } = require('../controllers/cube');
const auth = require('../middlewares/auth');

module.exports = (app) => {
  app.get('/', auth(false), home);
  app.get('/about', auth(false), about);

  app.use(require('../routes/auth'));
  app.use(require('../routes/cube'));
  app.use(require('../routes/accessory'));

  app.get('*', notFound);
};
