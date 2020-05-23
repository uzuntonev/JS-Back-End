const { accessoryModel, cubeModel } = require('../models');

function accessoryGetCreate(req, res) {
  const user = req.user || null;
  res.render('createAccessory', { user });
}

function accessoryPostCreate(req, res, next) {
  const newAccessory = req.body;
  if (!newAccessory.name || !newAccessory.imageUrl) {
    req.flash('error_msg', 'Name or image url are not valid.');
    res.redirect('/create/accessory');
    return;
  }

  accessoryModel
    .insertMany(newAccessory)
    .then(() => {
      req.flash('success_msg', 'You are creat accessory successfully');
      res.redirect('/');
    })
    .catch((err) => {
      if (err.errors.imageUrl) {
        req.flash('error_msg', 'Image url must be valid link.');
        res.redirect('/create/accessory');
        return;
      }
      next(err);
    });
}

function accessoryGetAttach(req, res, next) {
  const user = req.user || null;
  const { id: cubeId } = req.params;
  cubeModel
    .findById(cubeId)
    .then((cube) => {
      return Promise.all([
        cube,
        accessoryModel.find({ cubes: { $nin: cubeId } }),
      ]);
    })
    .then(([cube, accessories]) => {
      res.render('attachAccessory', { cube, accessories, user });
    })
    .catch(next);
}

function accessoryPostAttach(req, res, next) {
  const { accessory: accessoryId } = req.body;
  const { id: cubeId } = req.params;
  Promise.all([
    cubeModel.update({ _id: cubeId }, { $push: { accessories: accessoryId } }),
    accessoryModel.update({ _id: accessoryId }, { $push: { cubes: cubeId } }),
  ])
    .then(() => {
      req.flash('success_msg', 'You are attach accessory successfully');
      res.redirect('/');
    })
    .catch(next);
}

module.exports = {
  accessoryGetAttach,
  accessoryGetCreate,
  accessoryPostAttach,
  accessoryPostCreate,
};
