const { cubeModel } = require('../models');

function home(req, res, next) {
  const { from, to, search } = req.query;
  const { user } = req;
  const query = {};
  if (search) {
    Object.assign(query, { name: { $regex: search } });
  }
  if (to) {
    Object.assign(query, { difficultyLevel: { $lte: to } });
  }
  if (from) {
    Object.assign(query, { difficultyLevel: { $gte: from } });
  }
  cubeModel
    .find(query)
    .then((cubes) => {
      res.render('index', { cubes, user });
    })
    .catch(next);
}

function about(req, res) {
  res.render('about');
}

function details(req, res, next) {
  cubeModel
    .findById(req.params.id)
    .populate('accessories')
    .then((cube) => {
      console.log(cube);
      res.render('details', cube);
    })
    .catch(next);
}

function getCreate(req, res) {
  res.render('create');
}

function postCreate(req, res, next) {
  const newCube = req.body;
  if (!newCube.name || !newCube.imageUrl) {
    res.redirect('create');
    return;
  }
  cubeModel
    .insertMany(newCube)
    .then(() => {
      res.redirect('/');
    })
    .catch(next);
}

function notFound(req, res) {
  res.render('404');
}
module.exports = {
  home,
  about,
  details,
  getCreate,
  postCreate,
  notFound,
};
