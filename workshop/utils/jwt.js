const jwt = require('jsonwebtoken');
const secret = 'shhhhh';
function createToke(data) {
  return jwt.sign(
    data,
    secret,
    { expiresIn: '2h' }
  );
}

function verifyToke(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

module.exports = {
  createToke,
  verifyToke,
};
