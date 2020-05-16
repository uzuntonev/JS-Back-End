const cubeModel = require('../models/_Cube');

function home(req, res, next) {
  const { from, to, search } = req.query;
  const pred = (cube) => {
    let result = true;
    if (search) {
      result = cube.name.toLowerCase().includes(search.toLowerCase());
    } else if (result && from && to) {
      result = +cube.difficultyLevel >= +from && +cube.difficultyLevel <= +to;
    } else if (result && from) {
      result = +cube.difficultyLevel >= +from;
    } else if (result && to) {
      result = +cube.difficultyLevel <= +to;
    }
    return result;
  };
  cubeModel.find(pred).then((cubes) => {
    res.render('index', { cubes });
  });
}

function about(req, res) {
  res.render('about');
}

function details(req, res, next) {
  cubeModel
    .get(req.params.id)
    .then((cube) => {
      res.render('details', cube);
    })
    .catch(next);
}

function getCreate(req, res) {
  res.render('create');
}

function postCreate(req, res) {
  const newCube = req.body;
  if (!newCube.name || !newCube.imageUrl) {
    res.redirect('create');
    return;
  }
  cubeModel
    .create(newCube)
    .then((data) => {
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
