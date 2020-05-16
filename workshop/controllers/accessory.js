const { accessoryModel, cubeModel } = require('../models');

function accessoryGetCreate(req, res) {
  res.render('createAccessory');
}

function accessoryPostCreate(req, res) {
  const newAccessory = req.body;
  if (!newAccessory.name || !newAccessory.imageUrl) {
    res.redirect('create');
    return;
  }

  accessoryModel.insertMany(newAccessory).then(() => {
    res.redirect('/');
  });
}

function accessoryGetAttach(req, res, next) {
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
      res.render('attachAccessory', { cube, accessories });
    })
    .catch(next);
}

function accessoryPostAttach(req, res, next) {
  const { accessory } = req.body;
  const { id: cubeId } = req.params;
  Promise.all([
    cubeModel.update({ _id: cubeId }, { $push: { accessories: accessory } }),
    accessoryModel.update({ _id: accessory }, { $push: { cubes: cubeId } }),
  ])
    .then(() => {
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
