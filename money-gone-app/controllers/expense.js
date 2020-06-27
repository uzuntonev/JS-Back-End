const { expenseModel, userModel } = require('../models');

function home(req, res, next) {
  const { user } = req;

  expenseModel
    .find(user ? { user: user.id } : {})
    .lean()
    .then((expenses) => {
      const mapExpenses = expenses.map((e) => {
        return {
          ...e,
          date: e.date.toString().substring(0, 10),
        };
      });
      res.render('index', { expenses: mapExpenses, user });
    })
    .catch(next);
}

function report(req, res, next) {
  const user = req.user || null;
  const { id } = req.params;
  expenseModel
    .findById(id)
    .lean()
    .then((expense) => {
      res.render('report', {
        expense: { ...expense, date: expense.date.toString().substring(0, 10) },
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
  const newExpense = req.body;
  const { user } = req;

  if (newExpense.merchant.length < 4) {
    req.flash('error_msg', 'Merchant should be at least 4 characters');
    res.redirect('create');
    return;
  }
  if (newExpense.total < 0) {
    req.flash('error_msg', 'Amount should be positive number');
    res.redirect('create');
    return;
  }
  if (newExpense.description < 10 || newExpense.description > 50) {
    req.flash(
      'error_msg',
      'Description should be at least 10 and maximum 50 characters'
    );
    res.redirect('create');
    return;
  }

  Object.assign(newExpense, {
    user: req.user.id,
    report: newExpense.report ? true : false,
  });
  expenseModel
    .create(newExpense)
    .then((expense) => {
      return userModel.updateOne(
        { _id: user._id },
        { $push: { expenses: expense._id }, $inc: { amount: -expense.total } }
      );
    })
    .then(() => {
      req.flash('success_msg', 'You are create expense successfully');
      res.redirect('/');
    })
    .catch(next);
}

function getDelete(req, res, next) {
  const { id } = req.params;
  expenseModel
    .deleteOne({ _id: id })
    .then(() => {
      req.flash('success_msg', 'You are delete expense successfully');
      res.redirect('/');
    })
    .catch(next);
}

function postEditCube(req, res, next) {
  const { id } = req.params;
  const updated = req.body;
  expenseModel.updateOne({ _id: id }, { ...updated }).then(() => {
    req.flash('success_msg', 'You are edit expense successfully');
    res.redirect('/');
  });
}

function notFound(req, res) {
  const user = req.user || null;
  res.render('404', { user });
}
module.exports = {
  home,
  report,
  getCreate,
  postCreate,
  notFound,
  getDelete,
  postEditCube,
};
