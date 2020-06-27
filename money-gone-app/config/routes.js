const { home, notFound } = require('../controllers/expense');
const auth = require('../middlewares/auth');

module.exports = (app) => {
  app.get('/', auth(false), home);

  app.use(require('../routes/auth'));
  app.use(require('../routes/expense'));
  app.use(require('../routes/user'));

  app.get('*', notFound);
};
