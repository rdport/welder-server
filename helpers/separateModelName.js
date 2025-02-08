function separateModelName(modelName) {
  const splitted = modelName.split('');
  let result = '';
  for (let i = 0; i < splitted.length; i++) {
    if (i === splitted.length - 1) {
      result += splitted[i];
    } else {
      if (
        splitted[i + 1] === splitted[i + 1].toUpperCase()
        && splitted[i] !== ' '
        && splitted[i + 1] !== ' '
      ) {
        result += `${splitted[i]} `;
      } else {
        result += splitted[i];
      }
    } 
  }
  return result;
}

module.exports = separateModelName;