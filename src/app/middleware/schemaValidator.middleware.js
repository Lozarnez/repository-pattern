const schemaValidator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const joiError = error.details.map(({ message, context }) => {
        return {
          property: context.key,
          message: message.replace(/['"]/g, ''),
        };
      });

      return res.customResponse(joiError, 'Error in request', 422);
    }

    next();
  };
};

module.exports = schemaValidator;
