const formatFirstLetterUpperCase = require('../helpers/formatFirstLetterUpperCase');

function errorHandler(err, req, res, next) {
  console.log(err)
  if (err.status) {
    res.status(err.status).json({ message: err.message });
  } else if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    let errors = [];
    for (let i = 0; i < err.errors.length; i++) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        errors.push(err.errors[i].message);
      } else {
        if (err.errors[i].message === 'First name is required') {
          if (!errors.includes('First name is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Email is required') {
          if (!errors.includes('Email is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Email is invalid') {
          if (!errors.includes('Email is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Password is required') {
          if (!errors.includes('Password is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Password must contain at least 7 characters and maximum 128 characters') {
          if (!errors.includes('Password is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Class is required') {
          if (!errors.includes('Class is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Class is invalid') {
          if (!errors.includes('Class is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Position is required') {
          if (!errors.includes('Position is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Name is required') {
          if (!errors.includes('Name is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'City is required') {
          if (!errors.includes('City is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Measurement is required') {
          if (!errors.includes('Measurement is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Category is required') {
          if (!errors.includes('Category is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Date is required') {
          if (!errors.includes('Date is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Code is required') {
          if (!errors.includes('Code is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Purchase value must be numeric') {
          if (!errors.includes('Purchase value is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Purchase value cannot be less than 0') {
          if (!errors.includes('Purchase value must be numeric')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Paid amount must be numeric') {
          if (!errors.includes('Paid amount is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Purchase status is required') {
          if (!errors.includes('Purchase status is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Report status is required') {
          if (!errors.includes('Report status is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Size is required') {
          if (!errors.includes('Size is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Unit price must be numeric') {
          if (!errors.includes('Unit price is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Unit price cannot be less than 0') {
          if (!errors.includes('Unit price must be numeric')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Quantity must be numeric') {
          if (!errors.includes('Quantity is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Quantity must be at least 1' || err.errors[i].message === 'Quantity must be at least 0') {
          if (!errors.includes('Quantity must be numeric')) {
            errors.push(err.errors[i].message);
          }        
        } else if (err.errors[i].message === 'Address is required') {
          if (!errors.includes('Address is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Payment type is required') {
          if (!errors.includes('Payment type is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Payment type is invalid') {
          if (!errors.includes('Payment type is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Area must be numeric') {
          if (!errors.includes('Area is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Area must be greater than 0') {
          if (!errors.includes('Area must be numeric')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Material cost must be numeric') {
          if (!errors.includes('Material cost is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Material cost cannot be less than 0') {
          if (!errors.includes('Material cost must be numeric')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Labor cost must be numeric') {
          if (!errors.includes('Labor cost is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Labor cost cannot be less than 0') {
          if (!errors.includes('Labor cost must be numeric')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Electricity cost must be numeric') {
          if (!errors.includes('Electricity cost is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Electricity cost cannot be less than 0') {
          if (!errors.includes('Electricity cost must be numeric')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Other cost must be numeric') {
          if (!errors.includes('Other cost is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Other cost cannot be less than 0') {
          if (!errors.includes('Other cost must be numeric')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Commission rate must be numeric') {
          if (!errors.includes('Commission rate is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Commission rate cannot be less than 0') {
          if (!errors.includes('Commission rate must be numeric')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Production status is required') {
          if (!errors.includes('Production status is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Unit cost must be numeric') {
          if (!errors.includes('Unit cost is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Unit cost cannot be less than 0') {
          if (!errors.includes('Unit cost must be numeric')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Title is required') {
          if (!errors.includes('Title is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Payment value must be numeric') {
          if (!errors.includes('Payment value is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Payment value must be greater than 0') {
          if (!errors.includes('Payment value must be numeric')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Value must be numeric') {
          if (!errors.includes('Value is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Value must be greater than 0') {
          if (!errors.includes('Value must be numeric')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Category is invalid') {
          if (!errors.includes('Category is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Normally is required') {
          if (!errors.includes('Normally is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Normally is invalid') {
          if (!errors.includes('Normally is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Entry is required') {
          if (!errors.includes('Entry is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Entry is invalid') {
          if (!errors.includes('Entry is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Index must be numeric') {
          if (!errors.includes('Index is required')) {
            errors.push(err.errors[i].message);
          }
        } else if (err.errors[i].message === 'Index cannot be less than 0') {
          if (!errors.includes('Index must be numeric')) {
            errors.push(err.errors[i].message);
          }
        } else {
          errors.push(err.errors[i].message);
        }
      }
    }
    res.status(400).json({ message: errors });
    console.log(errors)
  } else if (err.name === "SequelizeDatabaseError") {
    res.status(400).json({ message: formatFirstLetterUpperCase(err.message, ' ',) });
    console.log(formatFirstLetterUpperCase(err.message, ' '), "<<<<<<<")
  } else if (err.name === "SequelizeForeignKeyConstraintError") {
    res.status(400).json({ message: 'Foreign Key Constraint Error_' + err.parent.detail });
  } else if (err.name === "TokenExpiredError") {
    res.status(401).json({ message: 'Session expired' });
  } else if (err.name === "JsonWebTokenError") {
    res.status(401).json({ message: 'Unauthorized Access!' });
  } else {
      res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = errorHandler;
