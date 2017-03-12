module.exports = {
  UnequalBracketsError: UnequalBracketsError,
  EndWithOperatorError: EndWithOperatorError,
  BracketsNotValidError: BracketsNotValidError,
  BracketsEmptyError: BracketsEmptyError
}

function EndWithOperatorError(message) {
  this.name = 'EndWithOperatorError';
  this.message = message || 'Formula ends with an operator';
  this.stack = (new Error()).stack;
}
UnequalBracketsError.prototype = Object.create(Error.prototype);
UnequalBracketsError.prototype.constructor = UnequalBracketsError;

function UnequalBracketsError(message) {
  this.name = 'UnequalBracketsError';
  this.message = message || 'Please provide an equal number of opening and closing brackets';
  this.stack = (new Error()).stack;
}
UnequalBracketsError.prototype = Object.create(Error.prototype);
UnequalBracketsError.prototype.constructor = UnequalBracketsError;

function BracketsNotValidError(message) {
  this.name = 'BracketsNotValidError';
  this.message = message || 'Brackets closed without being opened';
  this.stack = (new Error()).stack;
}
BracketsNotValidError.prototype = Object.create(Error.prototype);
BracketsNotValidError.prototype.constructor = BracketsNotValidError;

function BracketsEmptyError(message) {
  this.name = 'BracketsEmptyError';
  this.message = message || 'Cannot evaluate empty brackets';
  this.stack = (new Error()).stack;
}
BracketsEmptyError.prototype = Object.create(Error.prototype);
BracketsEmptyError.prototype.constructor = BracketsEmptyError;

function NoArgumentsError(message) {
  this.name = 'NoArgumentsError';
  this.message = message || 'Operator has no arguments to operate on';
  this.stack = (new Error()).stack;
}
NoArgumentsError.prototype = Object.create(Error.prototype);
NoArgumentsError.prototype.constructor = NoArgumentsError;
