// Función para traducir los mensajes de error
function translateError(error) {
  const translations = {
    required: `debe tener la propiedad requerida '${error.params.missingProperty}'`,
    type: `debe ser de tipo ${error.params.type}`,
    additionalProperties: `el campo ${error.params.additionalProperty} no existe en el esquema`,
    format: `debe tener el formato correcto`,
    minimum: `debe ser mayor o igual que ${error.params.limit}`,
    maximum: `debe ser menor o igual que ${error.params.limit}`,
    minLength: `no debe tener menos de ${error.params.limit} caracteres`,
    maxLength: `no debe tener más de ${error.params.limit} caracteres`,
  };

  return translations[error.keyword] || error.message;
}

function validateSchema(schema) {
  return (req, res, next) => {
    const { body } = req;
    const valid = schema(body);
    if (!valid) {
      const errors = schema.errors.map(({ keyword, instancePath, params }) => {
        return {
          field:
            params.missingProperty ||
            params.additionalProperty ||
            instancePath.replace('/', ''),
          message: translateError({ keyword, params }),
        };
      });
      return res.customResponse(errors, 'Error in request', 422);
    }

    next();
  };
}

module.exports = validateSchema;
