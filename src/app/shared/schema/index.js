const addFormats = require('ajv-formats');
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

function schemasAdapter(schema) {
  return {
    schema,
    partialSchema: ajv.compile({ ...schema, $id: '', required: [] }),
    validate: ajv.compile(schema),
  };
}

// required schemas
const AddressSchema = require('./address.schema.json');

module.exports = {
  AddressSchema: schemasAdapter(AddressSchema),
};
