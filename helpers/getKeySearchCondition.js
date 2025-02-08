const { Sequelize, sequelize } = require('../models');
const Op = Sequelize.Op;
const getKey = require('./getKey');

function getKeySearchCondition(modelName, category, key, term, dateQuery) {
  const where = {
    [Op.and]: []
  };
  const associationLevel = key.split('_').length - 1;
  let year;
  let month;
  let day;
  if (dateQuery) {
    year = dateQuery.year;
    month = dateQuery.month;
    day = dateQuery.day;
  }
  if (category === 'fullName') {
    where[Op.and].push(sequelize.where(
      Sequelize.fn("concat", sequelize.col("firstName"), " ", sequelize.col("lastName")),
      { [Op.iLike]: `%${term}%` }
    ))
    return where;
  } else if (category === 'default') {
    let formattedKey = '';
    let columnName = '';
    const exceptions = ['date', 'surveyDate', 'startDate', 'endDate', 'referenceDate'];
    if (associationLevel) {
      formattedKey = getKey(key);
    } else {
      formattedKey = key;
    }
    if (exceptions.includes(formattedKey) && (year || month || day)) {
      columnName = `"${modelName}"."${formattedKey}"`;
      if (year) {
        where[Op.and].push(
          sequelize.where(sequelize.fn("DATE_PART", "YEAR", sequelize.col(columnName)), `${year}`)
        );
      }
      if (month) {
        where[Op.and].push(
          sequelize.where(sequelize.fn("DATE_PART", "MONTH", sequelize.col(columnName)), `${month}`)
        );
      }
      if (day) {
        where[Op.and].push(
          sequelize.where(sequelize.fn("DATE_PART", "DAY", sequelize.col(columnName)), `${day}`)
        );
      }
      return where;
    } else {
      if (formattedKey === 'referenceCode') {
        formattedKey = 'code';
      }
      columnName = `"${modelName}"."${formattedKey}"`;
      where[Op.and].push(sequelize.where(
        sequelize.cast(sequelize.col(columnName), 'varchar'),
        { [Op.iLike]: `%${term}%` }
      ));
      return where;
    }
  }
}

module.exports = getKeySearchCondition;