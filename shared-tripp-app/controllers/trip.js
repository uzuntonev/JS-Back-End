//TODO: Change items, item and newItem

const { tripModel, userModel } = require('../models');

function index(req, res, next) {
  const { user } = req;
  res.render('index', { user });
}

function getSharedTrips(req, res, next) {
  const { user } = req;
  tripModel
    .find({})
    .lean()
    .then((trips) => {
      res.render('shared-trips', { trips, user });
    })
    .catch(next);
}

function details(req, res, next) {
  const user = req.user || null;
  const { id } = req.params;
  tripModel
    .findById(id)
    .populate('creatorId')
    .populate('buddies')
    .lean()
    .then((trip) => {
      const isCreator = trip.creatorId.email === user.email ? true : false;
      const isInclude = trip.buddies.find( x => x.email === user.email) ? true : false;
      const isFull = trip.seats === 0 ? true : false;

      res.render('details', {
        ...trip,
        isCreator,
        isInclude,
        isFull,
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
  const { startAndEndPoint, dateTime, carImage, seats, description } = req.body;
  const { user } = req;
  const [startPoint, endPoint] = startAndEndPoint.split(' - ');
  const [date, time] = dateTime.split(' - ');

  tripModel
    .create({
      startPoint,
      endPoint,
      date,
      time,
      carImage,
      seats,
      description,
      creatorId: user._id,
    })
    .then(() => {
      req.flash('success_msg', 'You are create successfully');
      res.redirect('/');
    })
    .catch(next);
}

function getDelete(req, res, next) {
  const { id } = req.params;
  tripModel
    .deleteOne({ _id: id })
    .then(() => {
      req.flash('success_msg', 'You are delete successfully');
      res.redirect('/');
    })
    .catch(next);
}

function joinToTrip(req, res, next) {
  const { user } = req;
  const { id } = req.params;

  tripModel
    .updateOne(
      { _id: id },
      { $push: { buddies: user.id }, $inc: { seats: -1 } }
    )
    .then(() => {
      req.flash('success_msg', 'You are join successfully');
      res.redirect(`/details/${id}`);
    })
    .catch(next);
}

function notFound(req, res) {
  const user = req.user || null;
  res.render('404', { user });
}
module.exports = {
  index,
  details,
  getCreate,
  postCreate,
  notFound,
  getDelete,
  joinToTrip,
  getSharedTrips,
};
