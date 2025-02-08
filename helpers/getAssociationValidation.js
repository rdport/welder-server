function getAssociationValidation(label, DataTypes) {
  return {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        args: true,
        msg: `${label} is required`
      },
      isNumeric: {
        args: true,
        msg: `${label.includes('Id') ? label : label + ' Id'} must be numeric`
      },
      min: {
        args: [1],
        msg: `${label.includes('Id') ? label : label + ' Id'} must be greater than 0`
      }
    }
  }
}

module.exports = getAssociationValidation;