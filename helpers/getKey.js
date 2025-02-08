function getKey(str) {
  const splitted = str.split('_');
  const associationLevel = splitted.length - 1;
  return splitted.slice(associationLevel)[0];
}

module.exports = getKey;