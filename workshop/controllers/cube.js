const { cubeModel, userModel } = require('../models');

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
  const user = req.user || null;
  res.render('about', { user });
}

function details(req, res, next) {
  const user = req.user || null;
  const { id } = req.params;
  cubeModel
    .findById(id)
    .populate('accessories')
    .then((cube) => {
      res.render('details', { cube, user });
    })
    .catch(next);
}

function getCreate(req, res) {
  const user = req.user || null;
  res.render('create', { user });
}

function postCreate(req, res, next) {
  const newCube = req.body;
  if (!newCube.name || !newCube.imageUrl) {
    req.flash('error_msg', 'Enter valid name and image url.');
    res.redirect('create');
    return;
  }
  Object.assign(newCube, { creatorId: req.user.id });
  cubeModel
    .insertMany(newCube)
    .then(() => {
      req.flash('success_msg', 'You are create cube successfully');
      res.redirect('/');
    })
    .catch(next);
}

function getDeleteCube(req, res, next) {
  const { id } = req.params;
  const { user } = req;

  cubeModel
    .findById(id)
    .then((cube) => {
      const options = [
        { title: '1 - Very Easy', selected: 1 == cube.difficultyLevel },
        { title: '2 - Easy', selected: 2 == cube.difficultyLevel },
        {
          title: '3 - Medium (Standard 3x3)',
          selected: 3 == cube.difficultyLevel,
        },
        { title: '4 - Intermediate', selected: 4 == cube.difficultyLevel },
        { title: '5 - Expert', selected: 5 == cube.difficultyLevel },
        { title: '6 - Hardcore', selected: 6 == cube.difficultyLevel },
      ];

      return Promise.all([cube, options, userModel.findById(cube.creatorId)]);
    })
    .then(([cube, options, creator]) => {
      const isCreator = creator.id === user.id;
      res.render('deleteCube', { cube, options, isCreator, user });
    })
    .catch(next);
}

function postDeleteCube(req, res, next) {
  const { id } = req.params;
  cubeModel
    .deleteOne({ _id: id })
    .then(() => {
      req.flash('success_msg', 'You are delete cube successfully');
      res.redirect('/');
    })
    .catch(next);
}

function getEditCube(req, res, next) {
  const { id } = req.params;

  cubeModel
    .findById(id)
    .then((cube) => {
      const options = [
        { title: '1 - Very Easy', selected: 1 == cube.difficultyLevel },
        { title: '2 - Easy', selected: 2 == cube.difficultyLevel },
        {
          title: '3 - Medium (Standard 3x3)',
          selected: 3 == cube.difficultyLevel,
        },
        { title: '4 - Intermediate', selected: 4 == cube.difficultyLevel },
        { title: '5 - Expert', selected: 5 == cube.difficultyLevel },
        { title: '6 - Hardcore', selected: 6 == cube.difficultyLevel },
      ];
      res.render('editCube', { cube, options });
    })
    .catch(next);
}

function postEditCube(req, res, next) {
  const { id } = req.params;
  const updatedCube = req.body;
  cubeModel
    .updateOne(
      { _id: id },
      { ...updatedCube, difficultyLevel: +req.body.difficultyLevel + 1 }
    )
    .then(() => {
      req.flash('success_msg', 'You are edit cube successfully');
      res.redirect('/');
    });
}

function notFound(req, res) {
  const user = req.user || null;
  res.render('404', { user });
}
module.exports = {
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
};
