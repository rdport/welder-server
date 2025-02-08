function formatNumberInput(input) {
  if (typeof input === 'string') {
    return input.trim() === '' ? null : +input;
  } else return +input
}

module.exports = formatNumberInput;