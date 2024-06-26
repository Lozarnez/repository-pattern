/**
 *
 * @param {function} validator - AJV validator function
 * @param {object} data - Data to validate
 * @returns {string[]} - Returns an array of error messages
 */
function validateSchema(validator, data) {
  const valid = validator(data);
  if (!valid) {
    const errors = validator.errors.map(({ instancePath, params, message }) => {
      return {
        field:
          params.missingProperty ||
          params.additionalProperty ||
          instancePath.replace('/', ''),
        message: message,
      };
    });

    return [false, errors];
  }
  return [true, []];
}

module.exports = validateSchema;
