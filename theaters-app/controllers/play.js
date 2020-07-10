const { playModel, userModel } = require('../models');

function index(req, res, next) {
  const { user } = req;
  const { sort } = req.query;
  const sortPlays = {
    byDate: () => {
      playModel
        .find({ isPublic: true })
        .sort({ createdAt: -1 })
        .lean()
        .then((plays) => {
          res.render('index', { plays, user });
        })
        .catch(next);
    },
    byLikes: () => {
      playModel
        .find({ isPublic: true })
        .sort({ likes: -1 })
        .lean()
        .then((plays) => {
          res.render('index', { plays, user });
        })
        .catch(next);
    },
  };

  if (sort) {
    sortPlays[sort]();
    return
  }
  if (!user) {
    playModel
      .find({ isPublic: true })
      .sort({ likes: -1 })
      .limit(3)
      .lean()
      .then((plays) => {
        res.render('index', { plays });
      })
      .catch(next);
  } else {
    playModel
      .find({ isPublic: true })
      .sort({ createdAt: -1 })
      .lean()
      .then((plays) => {
        res.render('index', { plays, user });
      })
      .catch(next);
  }
}

function detailsPlay(req, res, next) {
  const user = req.user || null;
  const { id } = req.params;
  playModel
    .findById(id)
    .populate('usersLiked')
    .populate('creator')
    .lean()
    .then((play) => {
      const isCreator = user.username === play.creator.username ? true : false;
      const isLiked = play.usersLiked.find((p) => p.username === user.username);
      res.render('details', {
        ...play,
        isCreator,
        isLiked,
        user,
      });
    })
    .catch(next);
}

function getCreate(req, res) {
  const user = req.user || null;
  res.render('create', { user });
}

function postCreate(req, res, next) {
  const { user } = req;
  const { title, description, imageUrl, isPublic } = req.body;

  if (!title) {
    req.flash('error_msg', 'Title field url is required');
    res.render('create', {
      title,
      description,
      imageUrl,
      isPublic: isPublic ? true : false,
      creator: user._id,
    });
    return;
  }
  if (!description) {
    req.flash('error_msg', 'Description field is required');
    res.render('create', {
      title,
      description,
      imageUrl,
      isPublic: isPublic ? true : false,
      creator: user._id,
    });
    return;
  }
  if (!imageUrl) {
    req.flash('error_msg', 'Image url field is required');
    res.render('create', {
      title,
      description,
      imageUrl,
      isPublic: isPublic ? true : false,
      creator: user._id,
    });
    return;
  }

  playModel
    .create({
      title,
      description,
      imageUrl,
      isPublic: isPublic ? true : false,
      creator: user._id,
    })
    .then(() => {
      req.flash('success_msg', 'You are create successfully');
      res.redirect('/');
    })
    .catch(next);
}

function getEdit(req, res, next) {
  const { id } = req.params;
  playModel
    .findOne({ _id: id })
    .lean()
    .then((play) => {
      res.render('edit', { ...play });
    })
    .catch(next);
}

function postEdit(req, res, next) {
  const { title, description, imageUrl, isPublic } = req.body;
  const { id } = req.params;

  if (!title) {
    req.flash('error_msg', 'Title field url is required');
    res.render('create', {
      title,
      description,
      imageUrl,
      isPublic: isPublic ? true : false,
      creator: user._id,
    });
    return;
  }
  if (!description) {
    req.flash('error_msg', 'Description field is required');
    res.render('create', {
      title,
      description,
      imageUrl,
      isPublic: isPublic ? true : false,
      creator: user._id,
    });
    return;
  }
  if (!imageUrl) {
    req.flash('error_msg', 'Image url field is required');
    res.render('create', {
      title,
      description,
      imageUrl,
      isPublic: isPublic ? true : false,
      creator: user._id,
    });
    return;
  }
  playModel
    .updateOne(
      { _id: id },
      {
        title,
        description,
        imageUrl,
        isPublic: isPublic ? true : false,
      }
    )
    .then(() => {
      req.flash('success_msg', 'You are edited successfully');
      res.redirect('/');
    })
    .catch(next);
}

function getLiked(req, res, next) {
  const { id: playId } = req.params;
  const { id: userId } = req.user;

  playModel
    .updateOne(
      { _id: playId },
      { $inc: { likes: 1 }, $push: { usersLiked: userId } }
    )
    .then(() => {
      return userModel.updateOne(
        { _id: userId },
        { $push: { likedPlays: playId } }
      );
    })
    .then(() => {
      res.redirect(`/details/${playId}`);
    })
    .catch(next);
}

function getDelete(req, res, next) {
  const { id } = req.params;
  playModel
    .deleteOne({ _id: id })
    .then(() => {
      req.flash('success_msg', 'You are delete successfully');
      res.redirect('/');
    })
    .catch(next);
}

function notFound(req, res) {
  const user = req.user || null;
  res.render('404', { user });
}
module.exports = {
  index,
  detailsPlay,
  getCreate,
  postCreate,
  notFound,
  getDelete,
  getLiked,
  getEdit,
  postEdit,
};
