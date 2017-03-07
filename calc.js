// Returns whether or not to replace the last char with the current one
function replaceLastChar(newChar, lastChar, penultimateChar) {
  // Operator followed by another operator - choose the latest
  if (isOperator(lastChar) && isOperator(newChar))
    return true;

  // If zero followed by a number, we can potentially remove the zero...
  if (lastChar === '0' && isNumber(newChar)
    /* If the zero was not preceded by a number:
       e.g. +0 followed by 1 becomes +1  (remove the zero)
       and   0 followed by 1 becomes 1   (remove the zero)
       but  10 followed by 1 becomes 101 (keep the zero)*/
    && (!isNumber(penultimateChar) || penultimateChar == ''))
    return true;

  return false;
}
