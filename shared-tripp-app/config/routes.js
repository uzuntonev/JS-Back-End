const { index, notFound } = require('../controllers/trip');
const auth = require('../middlewares/auth');

module.exports = (app) => {
  app.get('/', auth(false), index);

  app.use(require('../routes/auth'));
  app.use(require('../routes/trip'));  

  app.get('*', notFound);
};
