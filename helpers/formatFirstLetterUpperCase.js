function formatFirstLetterUpperCase(str, separator) {
  const splitted = str.split(separator);
  const firstWord = splitted[0];
  let firstLetterFirstWordOnlyUpperCase = '';
    for (let i = 0; i < firstWord.length; i++) {
      if (i === 0) {
        firstLetterFirstWordOnlyUpperCase += firstWord[i].toUpperCase();
      } else {
        firstLetterFirstWordOnlyUpperCase += firstWord[i];
      }
    }
  splitted.splice(0, 1, firstLetterFirstWordOnlyUpperCase);
  return splitted.join(' ');
}

module.exports = formatFirstLetterUpperCase;