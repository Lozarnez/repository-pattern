const addFormats = require('ajv-formats');
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// required schemas
const AddressSchema = require('./address.schema.json');

module.exports = {
  AddressSchema,
  vAddress: ajv.compile(AddressSchema),
};
