const bcrypt = require('bcryptjs');

function hash(password) {
  const salt = bcrypt.genSaltSync(+process.env.SALT);
  return bcrypt.hashSync(password, salt);
}

function compare(password, hashed) {
  return bcrypt.compareSync(password, hashed);
}

module.exports = {
    hash, 
    compare
}