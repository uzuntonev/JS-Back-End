const { userModel } = require('../models');

function getUser(req, res, next) {
  const { user } = req;

  userModel
    .findOne({ _id: user.id })
    .populate('expenses')
    .then((userData) => {
      const totalAmount = userData.expenses.reduce((acc, curr) => {
        return acc + curr.total;
      }, 0);

      const data = {
        totalAmount,
        totalMerches: userData.expenses.length,
        amount: (userData.amount - totalAmount).toFixed(2),
      };
      res.render('account-info', { ...data, user });
    })
    .catch(next);
}

function refillAmount(req, res, next) {
  const { refill } = req.body;
  const { user } = req;
  userModel
    .updateOne({ _id: user.id }, { $inc: { amount: refill } })
    .then(() => {
      req.flash('success_msg', 'You are refill account amount successfully');
      res.redirect('/');
    })
    .catch(next);
}
module.exports = {
  getUser,
  refillAmount,
};
